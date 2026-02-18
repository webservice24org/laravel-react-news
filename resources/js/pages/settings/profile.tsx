import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import ProfileDetailsForm from '@/components/Users/ProfileDetailsForm';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile Settings</h1>

            <SettingsLayout>
                <Tabs defaultValue="basic" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                        <TabsTrigger value="basic">
                            Profile Information
                        </TabsTrigger>
                        <TabsTrigger value="details">
                            Profile Details
                        </TabsTrigger>
                    </TabsList>

                    {/* ================= TAB 1 ================= */}
                    <TabsContent value="basic">
                        <div className="space-y-6">
                            <Heading
                                variant="small"
                                title="Profile information"
                                description="Update your name and email address"
                            />

                            <Form
                                {...ProfileController.update.form()}
                                options={{ preserveScroll: true }}
                                className="space-y-6"
                            >
                                {({ processing, recentlySuccessful, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">Name</Label>

                                            <Input
                                                id="name"
                                                defaultValue={auth.user.name}
                                                name="name"
                                                required
                                                autoComplete="name"
                                            />

                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="email">
                                                Email address
                                            </Label>

                                            <Input
                                                id="email"
                                                type="email"
                                                defaultValue={auth.user.email}
                                                name="email"
                                                required
                                            />

                                            <InputError message={errors.email} />
                                        </div>

                                        {mustVerifyEmail &&
                                            auth.user.email_verified_at ===
                                                null && (
                                                <div>
                                                    <p className="text-sm text-muted-foreground">
                                                        Your email is unverified.{' '}
                                                        <Link
                                                            href={send()}
                                                            as="button"
                                                            className="underline"
                                                        >
                                                            Resend verification
                                                        </Link>
                                                    </p>

                                                    {status ===
                                                        'verification-link-sent' && (
                                                        <p className="text-sm text-green-600">
                                                            Verification link
                                                            sent.
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                        <div className="flex items-center gap-4">
                                            <Button disabled={processing}>
                                                Save
                                            </Button>

                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition"
                                                enterFrom="opacity-0"
                                                leave="transition"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-muted-foreground">
                                                    Saved
                                                </p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </TabsContent>

                    {/* ================= TAB 2 ================= */}
                    <TabsContent value="details">
                        <ProfileDetailsForm />
                    </TabsContent>

                </Tabs>
            </SettingsLayout>
        </AppLayout>
    );
}

