/** Lấy chuỗi theo ngôn ngữ, rơi về tiếng Việt nếu bản dịch trống */
export const pick = (field, lang) => field?.[lang] || field?.vi || ''

export const pickList = (field, lang) => {
  const list = field?.[lang]?.length ? field[lang] : field?.vi
  return Array.isArray(list) ? list : []
}
