import { OauthSignIn } from '@/components/auth/oauth-signin';
import { Shell } from '@/components/shell/shell';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';

export default function SignInForm() {
  return (
    <Shell className='max-w-lg'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign in</CardTitle>
          <CardDescription>
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>

        <CardContent className='grid gap-4'>
          <OauthSignIn />
        </CardContent>
      </Card>
    </Shell>
  );
}
