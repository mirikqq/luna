import { PrismaLuna } from ".."

export interface User {
	id: string
	name?: string
}

export const createUser = async (user: User, referer?: string) => {
	return await PrismaLuna.user.upsert({
		where: { id: user.id },
		update: {},
		create: {
			id: user.id,
			name: user.name || "",
		},
	})
}
