class BrowserMouseController {
  constructor() {
    this.lastClickable = null;
    this.dragTarget = null;
    this.isDragging = false;
  }

  getClickableAtCursor(x, y) {
    const clickables = document.querySelectorAll(
      "[data-ai-clickable='true'], button, a, input, textarea, select, [role='button']"
    );

    for (const el of clickables) {
      if (el.disabled) continue;

      const rect = el.getBoundingClientRect();
      const padding = 50;

      const inside =
        x >= rect.left - padding &&
        x <= rect.right + padding &&
        y >= rect.top - padding &&
        y <= rect.bottom + padding;

      if (inside) return el;
    }

    return null;
  }

  dispatchMouseEvent(element, type, cursor) {
    element.dispatchEvent(
      new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: cursor.x,
        clientY: cursor.y,
        view: window,
      })
    );
  }

  clearHover() {
    if (!this.lastClickable) return;

    this.dispatchMouseEvent(this.lastClickable, "mouseleave", { x: 0, y: 0 });
    this.lastClickable.classList.remove("ai-hover");
    this.lastClickable = null;
  }

  update(cursor, clickState) {
    if (!cursor) return;

    const clickable = this.getClickableAtCursor(cursor.x, cursor.y);

    if (!this.isDragging && clickable !== this.lastClickable) {
      this.clearHover();

      if (clickable) {
        this.dispatchMouseEvent(clickable, "mouseover", cursor);
        this.dispatchMouseEvent(clickable, "mouseenter", cursor);
        clickable.classList.add("ai-hover");
        this.lastClickable = clickable;
      }
    }

    if (!this.isDragging && clickable) {
      this.dispatchMouseEvent(clickable, "mousemove", cursor);
    }

    // Start drag/click hold
    if (clickState.type === "click" && clickable) {
      this.dragTarget = clickable;
      this.isDragging = true;

      this.dispatchMouseEvent(this.dragTarget, "mousedown", cursor);
    }

    // While pinching, drag
    if (this.isDragging && this.dragTarget && clickState.type === "hold") {
      this.dispatchMouseEvent(this.dragTarget, "mousemove", cursor);
      document.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          cancelable: true,
          clientX: cursor.x,
          clientY: cursor.y,
          view: window,
        })
      );
    }

    // Release drag
    if (this.isDragging && this.dragTarget && clickState.type === "release") {
      this.dispatchMouseEvent(this.dragTarget, "mouseup", cursor);
      this.dispatchMouseEvent(this.dragTarget, "click", cursor);

      this.dragTarget = null;
      this.isDragging = false;
    }
  }
}

export default new BrowserMouseController();