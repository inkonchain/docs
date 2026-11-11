import { useEffect } from "react";

// Nextra marks the current page's sidebar link with this class
const ACTIVE = "a._bg-primary-100";

/**
 * Violet line over the grey guide line of nested sidebar lists: it sits on
 * the current page and springs to whichever item is hovered, returning when
 * the pointer leaves. Nextra's sidebar is internal, so the line is a single
 * element positioned inside its scroll container.
 */
export const SidebarIndicator = () => {
  useEffect(() => {
    let container: HTMLElement | null = null;
    let indicator: HTMLSpanElement | null = null;
    let hovered: HTMLElement | null = null;
    let frame = 0;

    // Only links in nested lists (the ones drawn with a guide line)
    const nestedLink = (target: EventTarget | null) => {
      const link =
        target instanceof Element ? target.closest<HTMLElement>("a") : null;
      const list = link?.closest("ul");
      return link && list?.parentElement?.closest("ul") ? link : null;
    };

    // Nextra collapses a folder by shrinking its wrapper to 0px, leaving the
    // links in the DOM, so check every ancestor up to the scroll container
    const isShown = (link: HTMLElement) => {
      for (
        let node: HTMLElement | null = link;
        node && node !== container;
        node = node.parentElement
      ) {
        if (node.getBoundingClientRect().height < 1) return false;
      }
      return true;
    };

    const place = (link: HTMLElement | null, animate = true) => {
      if (!container || !indicator) return;
      if (!link || !isShown(link)) {
        indicator.style.opacity = "0";
        return;
      }
      const list = link.closest("ul")!;
      const box = container.getBoundingClientRect();
      const listBox = list.getBoundingClientRect();
      const linkBox = link.getBoundingClientRect();
      // Match the text, not the link's padded hit area
      const { paddingTop, paddingBottom } = getComputedStyle(link);
      const top = Number.parseFloat(paddingTop) || 0;
      const bottom = Number.parseFloat(paddingBottom) || 0;
      indicator.style.transition = animate ? "" : "none";
      indicator.style.opacity = "1";
      indicator.style.left = `${listBox.left - box.left}px`;
      indicator.style.height = `${linkBox.height - top - bottom}px`;
      indicator.style.transform = `translateY(${
        linkBox.top - box.top + container.scrollTop + top
      }px)`;
    };

    const activeLink = () => {
      const active = container?.querySelector<HTMLElement>(ACTIVE) ?? null;
      return nestedLink(active);
    };

    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => place(hovered ?? activeLink()));
    };

    const onOver = (event: PointerEvent) => {
      const link = nestedLink(event.target);
      if (!link) {
        // Over a top-level item or a gap: back to the current page
        if (hovered) onLeave();
        return;
      }
      if (link === hovered) return;
      // Jumping into a different list: move there without sliding across
      const sameList = hovered?.closest("ul") === link.closest("ul");
      hovered = link;
      place(
        link,
        sameList || activeLink()?.closest("ul") === link.closest("ul")
      );
    };

    const onLeave = () => {
      hovered = null;
      place(activeLink());
    };

    const setup = () => {
      const next = document.querySelector<HTMLElement>(
        ".nextra-sidebar-container .nextra-scrollbar"
      );
      if (!next || next === container) return;
      container = next;
      container.style.position = "relative";
      indicator = document.createElement("span");
      indicator.className = "ink-sidebar-indicator";
      indicator.setAttribute("aria-hidden", "true");
      container.appendChild(indicator);
      container.addEventListener("pointerover", onOver);
      // Folders animate open/closed: settle once the transition ends
      container.addEventListener("transitionend", refresh);
      container.addEventListener("pointerleave", onLeave);
      place(activeLink(), false);
    };

    setup();
    // Page changes and folders opening/closing re-render the sidebar
    const observer = new MutationObserver(() => {
      setup();
      refresh();
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("resize", refresh);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", refresh);
      cancelAnimationFrame(frame);
      container?.removeEventListener("pointerover", onOver);
      container?.removeEventListener("transitionend", refresh);
      container?.removeEventListener("pointerleave", onLeave);
      indicator?.remove();
    };
  }, []);

  return null;
};
