/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/**
 * Create an adaptive number formatter that selects the most appropriate
 * magnitude suffix (K, M, B, T) for each value independently.
 *
 * @param {object} localization - Flourish localization instance.
 * @param {object} labelSettings - The state.labels settings object.
 * @param {object} numberFormatState - The raw state.number_format object (prefix, strip_zeros, negative_sign).
 * @returns {function} A function (value) => formatted string.
 */
export function createAdaptiveFormatter(localization, labelSettings, numberFormatState) {
    var scales = [];

    if (labelSettings.scale_trillions) {
        scales.push({ divisor: 1e12, suffix: labelSettings.scale_trillions_suffix || "T" });
    }
    if (labelSettings.scale_billions) {
        scales.push({ divisor: 1e9, suffix: labelSettings.scale_billions_suffix || "B" });
    }
    if (labelSettings.scale_millions) {
        scales.push({ divisor: 1e6, suffix: labelSettings.scale_millions_suffix || "M" });
    }
    if (labelSettings.scale_thousands) {
        scales.push({ divisor: 1e3, suffix: labelSettings.scale_thousands_suffix || "K" });
    }

    // Scales are ordered largest-first so the first match wins
    var n_dec = numberFormatState && numberFormatState.n_dec != null ? numberFormatState.n_dec : 2;
    var decimals = n_dec >= 0 ? Math.floor(n_dec) : 0;
    var space = labelSettings.adaptive_space ? " " : "";
    var prefix = (numberFormatState && numberFormatState.prefix) || "";
    var stripZeros = numberFormatState && numberFormatState.strip_zeros;
    var negativeSign = (numberFormatState && numberFormatState.negative_sign) || "minus";

    // getFormatterFunction() returns a d3 format factory: specifier -> formatter
    var formatFactory = localization.getFormatterFunction();
    var scaledFormatter = formatFactory(",." + decimals + "f");
    var plainFormatter = formatFactory(",f");

    return function(value) {
        if (value == null || isNaN(value)) return "";

        var isNegative = value < 0;
        var abs = Math.abs(value);
        var chosenScale = null;

        for (var i = 0; i < scales.length; i++) {
            if (abs >= scales[i].divisor) {
                chosenScale = scales[i];
                break;
            }
        }

        var formatted;
        if (chosenScale) {
            var divided = abs / chosenScale.divisor;
            formatted = scaledFormatter(divided);
            if (stripZeros) formatted = stripTrailingZeros(formatted);
            formatted = formatted + space + chosenScale.suffix;
        } else {
            // Below all enabled thresholds — format as plain number
            formatted = plainFormatter(abs);
            if (stripZeros) formatted = stripTrailingZeros(formatted);
        }

        // Assemble with prefix and negative sign
        if (isNegative) {
            if (negativeSign === "parentheses") {
                return "(" + prefix + formatted + ")";
            }
            return "-" + prefix + formatted;
        }

        return prefix + formatted;
    };
}

function stripTrailingZeros(s) {
    if (s.indexOf(".") === -1) return s;
    s = s.replace(/0+$/, "");
    s = s.replace(/\.$/, "");
    return s;
}
