'use server';

import AdminsService from '@/services/admin.service';
import AuthService from '@/services/auth.service';
import { revalidatePath } from 'next/cache';
import { redirect, RedirectType } from 'next/navigation';

export async function ExtendAdminExpiry(id: string, date: string) {
	await AdminsService.extendExpiry(id, date);
	revalidatePath('/[panel]/home/admin', 'page');
}

export async function SetMarkUpPrice(id: string, rate: number) {
	await AdminsService.setMarkUpPrice(id, rate);
	revalidatePath('/[panel]/home/admin', 'page');
}

export async function UpgradePlan(id: string, plan: string, date: string) {
	await AdminsService.upgradePlan(id, { plan_id: plan, date });
	revalidatePath('/[panel]/home/admin', 'page');
}

export async function switchServiceAccount(id: string) {
	const status = await AuthService.serviceAccount(id);
	if (status) {
		redirect('/admin/home/dashboard', RedirectType.replace);
	}
}