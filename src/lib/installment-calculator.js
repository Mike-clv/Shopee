function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateReducingBalanceSchedule({
  principal = 0,
  annualRate = 0,
  months = 1,
  monthlyFee = 0,
}) {
  const safePrincipal = Math.max(0, toNumber(principal));
  const safeAnnualRate = Math.max(0, toNumber(annualRate));
  const safeMonths = Math.max(1, Math.round(toNumber(months)));
  const safeMonthlyFee = Math.max(0, toNumber(monthlyFee));

  const monthlyRate = safeAnnualRate / 100 / 12;
  const basePrincipalPayment = safePrincipal / safeMonths;
  const schedule = [];

  let remainingPrincipal = safePrincipal;
  let totalInterest = 0;
  let totalPayment = 0;

  for (let month = 1; month <= safeMonths; month += 1) {
    const principalPayment = month === safeMonths
      ? remainingPrincipal
      : Math.min(remainingPrincipal, basePrincipalPayment);
    const interestPayment = remainingPrincipal * monthlyRate;
    const monthlyPayment = principalPayment + interestPayment + safeMonthlyFee;
    const remainingAfterPayment = Math.max(0, remainingPrincipal - principalPayment);

    totalInterest += interestPayment;
    totalPayment += monthlyPayment;

    schedule.push({
      month,
      openingBalance: remainingPrincipal,
      principalPayment,
      interestPayment,
      monthlyFee: safeMonthlyFee,
      totalPayment: monthlyPayment,
      closingBalance: remainingAfterPayment,
    });

    remainingPrincipal = remainingAfterPayment;
  }

  return {
    principal: safePrincipal,
    annualRate: safeAnnualRate,
    monthlyRate,
    months: safeMonths,
    monthlyFee: safeMonthlyFee,
    firstMonthPayment: schedule[0]?.totalPayment || 0,
    firstMonthInterest: schedule[0]?.interestPayment || 0,
    totalInterest,
    totalPayment,
    schedule,
  };
}
