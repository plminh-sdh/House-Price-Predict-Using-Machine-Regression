export interface PredictLoanModel {
    intRate: number;
    dti: number;
    revolBal: number;
    revolUtil: number;
    earliestCrLine: Date;
    annualInc: number;
    moSinOldIlAcct: number;
    loanAmnt: number;
    openAcc: number;
    ficoScore: number;
}