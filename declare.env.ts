declare module "bun" {
	interface Env {
		BOT_TOKEN: string
		SERVER_API: string
		CLIENTS_INBOUND_ID: string
		PANEL_LOGIN: string
		PANEL_PASSWORD: string
	}
}
