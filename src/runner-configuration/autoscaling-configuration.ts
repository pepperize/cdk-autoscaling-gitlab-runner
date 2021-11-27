/**
 * @see {@link https://docs.gitlab.com/runner/configuration/advanced-configuration.html#the-runnersmachineautoscaling-sections}
 */
export interface AutoscalingConfiguration {
  readonly idleCount?: number;
  readonly idleTime?: number;
  /**
   * The Periods setting contains an array of string patterns of time periods represented in a cron-style format.
   * https://github.com/gorhill/cronexpr#implementation
   *
   * [second] [minute] [hour] [day of month] [month] [day of week] [year]
   *
   * @example
   * // "* * 7-22 * * mon-fri *"
   */
  readonly periods?: string[];
  readonly timezone?: Timezone;
}

export type Timezone =
  | "Africa/Algiers"
  | "Africa/Cairo"
  | "Africa/Casablanca"
  | "Africa/Harare"
  | "Africa/Johannesburg"
  | "Africa/Monrovia"
  | "Africa/Nairobi"
  | "America/Argentina/Buenos_Aires"
  | "America/Bogota"
  | "America/Caracas"
  | "America/Chicago"
  | "America/Chihuahua"
  | "America/Denver"
  | "America/Godthab"
  | "America/Guatemala"
  | "America/Guyana"
  | "America/Halifax"
  | "America/Indiana/Indianapolis"
  | "America/Juneau"
  | "America/La_Paz"
  | "America/Lima"
  | "America/Los_Angeles"
  | "America/Mazatlan"
  | "America/Mexico_City"
  | "America/Monterrey"
  | "America/Montevideo"
  | "America/New_York"
  | "America/Phoenix"
  | "America/Regina"
  | "America/Santiago"
  | "America/Sao_Paulo"
  | "America/St_Johns"
  | "America/Tijuana"
  | "Asia/Almaty"
  | "Asia/Baghdad"
  | "Asia/Baku"
  | "Asia/Bangkok"
  | "Asia/Chongqing"
  | "Asia/Colombo"
  | "Asia/Dhaka"
  | "Asia/Hong_Kong"
  | "Asia/Irkutsk"
  | "Asia/Jakarta"
  | "Asia/Jerusalem"
  | "Asia/Kabul"
  | "Asia/Kamchatka"
  | "Asia/Karachi"
  | "Asia/Kathmandu"
  | "Asia/Kolkata"
  | "Asia/Krasnoyarsk"
  | "Asia/Kuala_Lumpur"
  | "Asia/Kuwait"
  | "Asia/Magadan"
  | "Asia/Muscat"
  | "Asia/Novosibirsk"
  | "Asia/Rangoon"
  | "Asia/Riyadh"
  | "Asia/Seoul"
  | "Asia/Shanghai"
  | "Asia/Singapore"
  | "Asia/Taipei"
  | "Asia/Tashkent"
  | "Asia/Tbilisi"
  | "Asia/Tehran"
  | "Asia/Tokyo"
  | "Asia/Ulaanbaatar"
  | "Asia/Urumqi"
  | "Asia/Vladivostok"
  | "Asia/Yakutsk"
  | "Asia/Yekaterinburg"
  | "Asia/Yerevan"
  | "Atlantic/Azores"
  | "Atlantic/Cape_Verde"
  | "Atlantic/South_Georgia"
  | "Australia/Adelaide"
  | "Australia/Brisbane"
  | "Australia/Darwin"
  | "Australia/Hobart"
  | "Australia/Melbourne"
  | "Australia/Perth"
  | "Australia/Sydney"
  | "Etc/UTC"
  | "Europe/Amsterdam"
  | "Europe/Athens"
  | "Europe/Belgrade"
  | "Europe/Berlin"
  | "Europe/Bratislava"
  | "Europe/Brussels"
  | "Europe/Bucharest"
  | "Europe/Budapest"
  | "Europe/Copenhagen"
  | "Europe/Dublin"
  | "Europe/Helsinki"
  | "Europe/Istanbul"
  | "Europe/Kiev"
  | "Europe/Lisbon"
  | "Europe/Ljubljana"
  | "Europe/London"
  | "Europe/Madrid"
  | "Europe/Minsk"
  | "Europe/Moscow"
  | "Europe/Paris"
  | "Europe/Prague"
  | "Europe/Riga"
  | "Europe/Rome"
  | "Europe/Sarajevo"
  | "Europe/Skopje"
  | "Europe/Sofia"
  | "Europe/Stockholm"
  | "Europe/Tallinn"
  | "Europe/Vienna"
  | "Europe/Vilnius"
  | "Europe/Warsaw"
  | "Europe/Zagreb"
  | "Pacific/Apia"
  | "Pacific/Auckland"
  | "Pacific/Chatham"
  | "Pacific/Fakaofo"
  | "Pacific/Fiji"
  | "Pacific/Guadalcanal"
  | "Pacific/Guam"
  | "Pacific/Honolulu"
  | "Pacific/Majuro"
  | "Pacific/Midway"
  | "Pacific/Noumea"
  | "Pacific/Pago_Pago"
  | "Pacific/Port_Moresby"
  | "Pacific/Tongatapu";
