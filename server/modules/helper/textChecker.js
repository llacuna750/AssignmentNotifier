/*
 *  Returns true only if it's a string AND not a valid number
 *  isNaN(Number('dwada'))  is Not a number?  true
 *  isNaN(Number('12312'))  is Not a number?  false
 */
function isPureTextString(...values) {
  return values.every(
    (value) => typeof value === "string" && Number.isNaN(Number(value.trim())),
  );
}

function isNumberExist(name) {
  return name.split("").some((v) => Number.isFinite(Number(v)));
}
export { isPureTextString, isNumberExist };
