// دالة لاحتساب العمر
export const calculateAge = (birthday: Date): number => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// دالة للتحقق من حالة العقد
export const getContractStatus = (
  endDate: Date
): { status: string; color: string } => {
  const today = new Date();
  const end = new Date(endDate);
  const daysUntilEnd = Math.ceil(
    (end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilEnd < 0) {
    return { status: "منتهي", color: "destructive" };
  } else if (daysUntilEnd <= 30) {
    return { status: "قريب الانتهاء", color: "warning" };
  } else {
    return { status: "نشط", color: "success" };
  }
};



// دالة لترجمة فئة اللاعب
 export const getPlayerClassText = (playerClass: string): string => {
  const classes: { [key: string]: string } = {
    professional: "محترف",
    amateur: "هواة",
    junior: "ناشئ",
    senior: "كبار",
  };
  return classes[playerClass] || playerClass;
};

// دالة لاستخراج نوع المستند من الـ URL
export const getDocumentType = (url: string): string => {
  if (url.includes('contract') || url.includes('عقد')) return 'عقد';
  if (url.includes('id') || url.includes('هوية')) return 'هوية';
  if (url.includes('license') || url.includes('رخصة')) return 'رخصة';
  if (url.includes('medical') || url.includes('طبي')) return 'شهادة طبية';
  return 'مستند';
};
