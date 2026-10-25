/** "U-12" -> "u12": yaş grubu kodundan URL parçası. */
export const ageGroupSlug = (code: string) => code.toLowerCase().replace(/[^a-z0-9]/g, "");

/** "U-12" -> "U12": puan durumundaki lig adıyla eşleşen biçim. */
export const ageGroupLeague = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

export const ageGroupPath = (code: string) => `/yas-gruplari/${ageGroupSlug(code)}`;
