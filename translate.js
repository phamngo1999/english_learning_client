const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const switchLanguage = document.getElementById('switchLanguage');
let isEnglishToVietnamese = false;

// Xử lý chuyển đổi ngôn ngữ
switchLanguage.addEventListener('click', async () => {
    isEnglishToVietnamese = !isEnglishToVietnamese;
    const sourceLabel = document.getElementById('sourceLabel');
    sourceLabel.textContent = isEnglishToVietnamese ? 'Tiếng Anh' : 'Tiếng Việt';
    const targetLabel = document.getElementById('targetLabel');
    targetLabel.textContent = isEnglishToVietnamese ? 'Tiếng Việt' : 'Tiếng Anh';

    // Hoán đổi nội dung
    const tempSourceText = sourceText.value == undefined ? '' : sourceText.value;
    const tempTargetText = targetText.innerHTML == undefined ? '' : targetText.innerHTML;
    sourceText.value = tempTargetText;
    targetText.innerHTML = "";
    if (sourceText.value != "") {
        targetText.innerHTML = "Đang dịch...";
        document.getElementById('pronunciation').innerHTML = '';
        await translateText(sourceText.value);
    }

    // Nếu có nội dung trong ô nguồn, tự động dịch
    // if (sourceText.value.trim()) {
    //     translateButton.click();
    // }
});


async function translateText(text) {
    const response = await fetch(`${CONFIG.SERVER_DOMAIN}/translate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
            direction: isEnglishToVietnamese ? 'en_to_vi' : 'vi_to_en'
        })
    });

    const data = await response.json();
    targetText.innerHTML = data.translated_text;
    if (!isEnglishToVietnamese && data.ipa) {
        document.getElementById('pronunciation').innerHTML = `<span class='font-bold'>Phiên âm:</span> ${data.ipa}`;
    }
}


let debounceTimer;
sourceText.addEventListener("input", function () {
    console.log("Textarea content changed to:", sourceText.value);
    clearTimeout(debounceTimer); // Clear previous timer
    targetText.innerHTML = "Đang dịch...";
    if (sourceText.value.trim() === "") {
        targetText.textContent = "";
        targetText.value = "";
        document.getElementById('pronunciation').innerHTML = '';
        return;
    }
    debounceTimer = setTimeout(async () => {
        await translateText(sourceText.value);
    }, 1000)
});