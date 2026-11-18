import { test } from "node:test";
import assert from "node:assert/strict";
import { POPOVER_TTL_MS, popoverReducer } from "./popover.ts";

test("명중하면 열린다", () => {
  assert.deepEqual(popoverReducer(null, { type: "hit", zone: "about", now: 1000 }), { zone: "about", openedAt: 1000 });
});

test("열린 상태에서 다른 영역 명중은 무시(처음 영역에 고정)", () => {
  const open = { zone: "about" as const, openedAt: 0 };
  const s = popoverReducer(open, { type: "hit", zone: "blog", now: 500 });
  assert.equal(s, open);
  assert.equal(s?.zone, "about");
  assert.equal(s?.openedAt, 0);
});

test("같은 영역 재명중은 타이머를 연장하지 않는다", () => {
  const open = { zone: "about" as const, openedAt: 0 };
  const s = popoverReducer(open, { type: "hit", zone: "about", now: 5000 });
  assert.equal(s?.openedAt, 0);
  assert.equal(popoverReducer(s, { type: "tick", now: POPOVER_TTL_MS }), null);
});

test("닫힌 뒤(dismiss) 새 명중은 새 영역으로 열린다", () => {
  const closed = popoverReducer({ zone: "about", openedAt: 0 }, { type: "dismiss" });
  assert.deepEqual(popoverReducer(closed, { type: "hit", zone: "blog", now: 700 }), { zone: "blog", openedAt: 700 });
});

test("6초 무응답이면 닫힌다(경계 포함)", () => {
  const open = { zone: "about" as const, openedAt: 0 };
  assert.equal(popoverReducer(open, { type: "tick", now: POPOVER_TTL_MS - 1 }), open);
  assert.equal(popoverReducer(open, { type: "tick", now: POPOVER_TTL_MS }), null);
});

test("dismiss는 열려 있을 때 닫고, 닫혀 있으면 null 유지", () => {
  assert.equal(popoverReducer({ zone: "blog", openedAt: 0 }, { type: "dismiss" }), null);
  assert.equal(popoverReducer(null, { type: "dismiss" }), null);
});

test("tick은 닫힌 상태를 바꾸지 않는다", () => {
  assert.equal(popoverReducer(null, { type: "tick", now: 99999 }), null);
});
