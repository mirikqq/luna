export const Events = {
	start: "show_menu",
	my_devices: "show_devices",
	referal: "show_referals",
	help: "show_help",
	help_ios: "show_help_ios",
	help_android: "show_help_android",
	help_macos: "show_help_macos",
	help_windows: "show_help_windows",
	help_tv: "show_help_tv",
	add_device: "show_add_device",
}

export const device = {
	ios: "ios",
	android: "android",
	macos: "mac",
	windows: "windows",
	tv: "tv",
} as const

export type Device = (typeof device)[keyof typeof device]

export const vlessConfig = (clientId: string, device: Device) => {
	return `vless://${clientId}@77.221.157.41:443?type=tcp&security=reality&pbk=P8Br-t4lniMl465q_3g6GjBE1KVT7evKg2BBDCwQ-wI&fp=chrome&sni=google.com&sid=3f08a3&spx=%2F#luna_clients-${clientId}-${device}`
}
