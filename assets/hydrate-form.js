/* ============================================================
   Booking form logic (checkout page only)
   ============================================================ */

function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const HOME_FEE = 60;

  function money(n) { return 'HK$' + Number(n).toLocaleString(); }

  function recalc() {
    const pkg = form.querySelector('.opt-group .opt.on[data-price]');
    const base = pkg ? +pkg.dataset.price : 0;
    const isHome = !!form.querySelector('.opt.on[data-home="1"]');
    const fee = isHome ? HOME_FEE : 0;
    const total = base + fee;

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('sumPackage', pkg ? pkg.dataset.name : '未选择');
    set('sumBase', base ? money(base) : '—');
    set('sumFee', fee ? money(fee) : '免费');
    set('sumTotal', total ? money(total) : '—');
  }

  // Package / service-mode single-select
  form.querySelectorAll('.opt-group').forEach((group) => {
    group.addEventListener('click', (e) => {
      const opt = e.target.closest('.opt');
      if (!opt) return;
      e.preventDefault();
      group.querySelectorAll('.opt').forEach((o) => o.classList.remove('on'));
      opt.classList.add('on');
      recalc();
    });
  });

  form.querySelectorAll('input[type=checkbox]').forEach((c) => c.addEventListener('change', recalc));
  recalc();

  // Submit → confirmation page with query params
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name=name]').value.trim();
    const phone = form.querySelector('[name=phone]').value.trim();
    if (!name) { alert('请填写姓名'); form.querySelector('[name=name]').focus(); return; }
    if (!phone) { alert('请填写联系电话'); form.querySelector('[name=phone]').focus(); return; }

    const params = new URLSearchParams();
    params.set('name', name);
    params.set('phone', phone);
    params.set('artist', form.querySelector('[name=artist]').value.split(' ·')[0]);
    params.set('date', form.querySelector('[name=date]').value);
    params.set('style', form.querySelector('[name=style]').value);
    const pkg = form.querySelector('.opt-group .opt.on[data-name]');
    if (pkg) params.set('package', pkg.dataset.name);
    const opt = form.querySelector('.opt.on[data-home="1"]');
    params.set('mode', opt ? '上门' : '到店');

    location.href = 'booking-confirmation.html?' + params.toString();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBookingForm);
} else {
  initBookingForm();
}
