/**
 * 暖家社区养老官网交互脚本
 * 包含：大字关怀模式、移动端导航、滚动渐入动画、导航高亮及预约沟通弹窗
 */
document.addEventListener("DOMContentLoaded", () => {
  const htmlEl = document.documentElement;
  const header = document.getElementById("site-header");
  const fontToggleBtn = document.getElementById("font-toggle-btn");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");

  // 1. 大字关怀模式初始化与切换（持久化存储用户偏好）
  const savedFontMode = localStorage.getItem("warmhome_large_text") === "true";
  if (savedFontMode) {
    htmlEl.classList.add("large-text-mode");
    fontToggleBtn?.setAttribute("aria-pressed", "true");
  }

  fontToggleBtn?.addEventListener("click", () => {
    const isLarge = htmlEl.classList.toggle("large-text-mode");
    fontToggleBtn.setAttribute("aria-pressed", String(isLarge));
    localStorage.setItem("warmhome_large_text", String(isLarge));
  });

  // 2. 顶部导航栏滚动阴影与激活状态
  const navLinks = document.querySelectorAll(".main-nav a");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const handleScroll = () => {
    if (window.scrollY > 12) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    const scrollPos = window.scrollY + 140;
    sections.forEach((sec, idx) => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach((l) => l.classList.remove("active"));
        navLinks[idx]?.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // 3. 移动端导航抽屉开关
  const closeDrawer = () => {
    mobileDrawer?.classList.remove("open");
    mobileMenuBtn?.setAttribute("aria-expanded", "false");
    mobileDrawer?.setAttribute("aria-hidden", "true");
  };

  mobileMenuBtn?.addEventListener("click", () => {
    const isOpen = mobileDrawer?.classList.toggle("open");
    mobileMenuBtn.setAttribute("aria-expanded", String(Boolean(isOpen)));
    mobileDrawer?.setAttribute("aria-hidden", String(!isOpen));
  });

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });

  // 4. 滚动渐入动画（IntersectionObserver）
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // 5. 预约沟通弹窗逻辑
  const modal = document.getElementById("consult-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalDoneBtn = document.getElementById("modal-done-btn");
  const consultForm = document.getElementById("consult-form");
  const formView = document.getElementById("modal-form-view");
  const successView = document.getElementById("modal-success-view");
  const serviceSelect = document.getElementById("service-select");

  const openModal = (preselectedService) => {
    closeDrawer();
    if (formView && successView) {
      formView.hidden = false;
      successView.hidden = true;
    }
    if (preselectedService && serviceSelect) {
      serviceSelect.value = preselectedService;
    }
    modal?.classList.add("open");
    modal?.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    modal?.classList.remove("open");
    modal?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".open-consult-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetService = btn.getAttribute("data-service");
      openModal(targetService);
    });
  });

  modalCloseBtn?.addEventListener("click", closeModal);
  modalDoneBtn?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("open")) {
      closeModal();
    }
  });

  // 表单提交处理（演示本地反馈，可后续对接后端接口）
  consultForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (formView && successView) {
      formView.hidden = true;
      successView.hidden = false;
    }
    consultForm.reset();
  });
});
