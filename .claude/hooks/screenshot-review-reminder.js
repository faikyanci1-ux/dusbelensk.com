#!/usr/bin/env node
// PostToolUse hook (Write|Edit): after a page/component file changes, remind
// Claude to visually verify it with playwright-cli before reporting back.
let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let data;
  try {
    data = JSON.parse(input);
  } catch {
    return;
  }
  const filePath = (data.tool_input && data.tool_input.file_path) || "";
  const normalized = filePath.replace(/\\/g, "/");
  const isPageOrComponent =
    /\/src\/app\/.*\.tsx$/.test(normalized) ||
    /\/src\/components\/.*\.tsx$/.test(normalized);
  if (!isPageOrComponent) return;

  const message =
    `Sayfa/bileşen değişti: ${normalized}. Bitirmeden önce: ` +
    `playwright-cli ile ilgili sayfayı aç (playwright-cli open http://localhost:3011/<yol>), ` +
    `playwright-cli screenshot ile ekran görüntüsü al, görüntüyü incele; bozuk bir şey ` +
    `varsa KULLANICIYA SÖYLEMEDEN ÖNCE düzelt ve tekrar ekran görüntüsü al. ` +
    `Sonra kullanıcıya öncesi ve sonrası ekran görüntüsünü göster.`;

  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: message,
      },
    })
  );
});
