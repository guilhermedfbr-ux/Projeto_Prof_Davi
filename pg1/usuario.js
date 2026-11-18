const $ = (s) => document.querySelector(s);

const toast = (message) => {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
};

// Navegação por abas
document.querySelectorAll('.user-tab').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.user-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.user-panel').forEach((p) => p.classList.remove('active'));
    button.classList.add('active');
    $('#panel-' + button.dataset.panel).classList.add('active');
  });
});

// Edição de perfil
const fields = [
  'full-name',
  'social-name',
  'pronouns',
  'institutional-email',
  'personal-email',
  'phone',
  'address',
];
let original = {};

function editing(on) {
  fields.forEach((id) => {
    const f = $('#' + id);
    f.disabled = !on;
    f.readOnly = !on && f.tagName !== 'SELECT';
  });
  $('#profile-actions').hidden = !on;
  $('#edit-profile').hidden = on;
}

$('#edit-profile').addEventListener('click', () => {
  original = Object.fromEntries(fields.map((id) => [id, $('#' + id).value]));
  editing(true);
  $('#full-name').focus();
});

$('#cancel-edit').addEventListener('click', () => {
  fields.forEach((id) => ($('#' + id).value = original[id]));
  editing(false);
});

$('#profile-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!e.target.reportValidity()) return;

  $('#profile-name-display').textContent =
    $('#social-name').value.trim() || $('#full-name').value.trim();
  $('#profile-ra-short').textContent = $('#ra').value;
  editing(false);
  toast('Dados atualizados nesta demonstração.');
});

// Upload e remoção de foto de perfil
let photoUrl = null;

$('#photo-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast('Selecione uma imagem válida.');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    toast('A imagem deve ter no máximo 5 MB.');
    e.target.value = '';
    return;
  }

  if (photoUrl) URL.revokeObjectURL(photoUrl);
  photoUrl = URL.createObjectURL(file);
  $('#profile-photo').src = photoUrl;
  toast('Foto de perfil atualizada.');
});

$('#remove-photo').addEventListener('click', () => {
  if (photoUrl) URL.revokeObjectURL(photoUrl);
  photoUrl = null;
  $('#profile-photo').src =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect width="120" height="120" rx="60" fill="%23e8efff"/%3E%3Ccircle cx="60" cy="43" r="22" fill="%2386a8e7"/%3E%3Cpath d="M20 112c4-25 19-38 40-38s36 13 40 38" fill="%2386a8e7"/%3E%3C/svg%3E';
  $('#photo-upload').value = '';
  toast('Foto de perfil removida.');
});

// Copiar matrícula (RA)
$('#copy-ra').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#ra').value);
    toast('Matrícula copiada.');
  } catch {
    $('#ra').select();
    document.execCommand('copy');
    toast('Matrícula copiada.');
  }
});

// Ações demonstrativas
document.querySelectorAll('.demo-action, .document-btn').forEach((b) => {
  b.addEventListener('click', () =>
    toast(
      `${b.dataset.doc || b.textContent.trim()}: recurso demonstrativo, requer integração com o sistema acadêmico.`
    )
  );
});

// Validação de alteração de senha
$('#password-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if ($('#new-password').value !== $('#confirm-password').value) {
    toast('As novas senhas não coincidem.');
    return;
  }
  toast('Validação concluída. Integre a alteração ao servidor para aplicá-la.');
  e.target.reset();
});

// Preferências de acessibilidade e tema
$('#dark-mode').addEventListener('change', (e) =>
  document.body.classList.toggle('dark-mode', e.target.checked)
);

$('#high-contrast').addEventListener('change', (e) =>
  document.body.classList.toggle('high-contrast', e.target.checked)
);

$('#font-size').addEventListener('change', (e) => {
  document.body.classList.remove('font-large', 'font-larger');
  if (e.target.value === 'large') document.body.classList.add('font-large');
  if (e.target.value === 'larger') document.body.classList.add('font-larger');
});
