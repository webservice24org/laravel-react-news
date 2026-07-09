export const formatBanglaDateTime = (date: string) => {
    const d = new Date(date);

    const weekdays = [
        "রবিবার",
        "সোমবার",
        "মঙ্গলবার",
        "বুধবার",
        "বৃহস্পতিবার",
        "শুক্রবার",
        "শনিবার",
    ];

    const months = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
    ];

    const toBanglaNumber = (value: string | number) =>
        value
            .toString()
            .replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);

    let hour = d.getHours();
    const minute = d.getMinutes();

    const period = hour >= 12 ? "অপরাহ্ণ" : "পূর্বাহ্ণ";

    hour = hour % 12 || 12;

    return `${toBanglaNumber(d.getDate())} ${
        months[d.getMonth()]
    } (${weekdays[d.getDay()]}), ${toBanglaNumber(
        d.getFullYear()
    )}, ${toBanglaNumber(hour)}:${toBanglaNumber(
        minute.toString().padStart(2, "0")
    )} (${period})`;
};