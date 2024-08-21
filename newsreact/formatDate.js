// src/formatDate.js
import moment from 'moment';
import 'moment/locale/bn';

// Custom mapping for Bangla month names
const banglaMonths = {
    'January': 'জানুয়ারি',
    'February': 'ফেব্রুয়ারি',
    'March': 'মার্চ',
    'April': 'এপ্রিল',
    'May': 'মে',
    'June': 'জুন',
    'July': 'জুলাই',
    'August': 'আগস্ট',
    'September': 'সেপ্টেম্বর',
    'October': 'অক্টোবর',
    'November': 'নভেম্বর',
    'December': 'ডিসেম্বর'
};

// Custom mapping for Bangla AM/PM
const banglaAmPm = {
    'AM': 'সকাল',
    'PM': 'অপরাহ্ন'
};

const formatDate = (date) => {
    moment.locale('bn');  
    let banglaDate = moment(date).format('DD MMMM YYYY, h:mm A');
    
    // Convert the month to Bangla
    Object.keys(banglaMonths).forEach(month => {
        banglaDate = banglaDate.replace(month, banglaMonths[month]);
    });

    // Convert the numbers to Bangla numerals
    const banglaNumerals = {
        '0': '০',
        '1': '১',
        '2': '২',
        '3': '৩',
        '4': '৪',
        '5': '৫',
        '6': '৬',
        '7': '৭',
        '8': '৮',
        '9': '৯'
    };
    banglaDate = banglaDate.replace(/[0-9]/g, (match) => banglaNumerals[match]);

    // Convert AM/PM to Bangla
    Object.keys(banglaAmPm).forEach(ampm => {
        banglaDate = banglaDate.replace(ampm, banglaAmPm[ampm]);
    });

    return banglaDate;
};

export default formatDate;
