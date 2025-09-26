import {
  AtSymbolIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../ui/button';

export default function LoginForm() {
  return (
    <form className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 mt-14">
        <h1>Please log in to continue.</h1>
      </div>
      <div className="justify-items-center bg-blue">
        {/* Email field */}
        <label className="block" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email address"
            required
          />
          {/* <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
        </div>

        {/* Password field */}
        <label className="mt-4 block" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
            required
            minLength={6}
          />
          {/* <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
        </div>

        {/* Submit button */}
        <Button className="mt-4 w-25">
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        {/* Error messages */}
        <div className="flex h-8 items-end space-x-1">
          {/* Add form errors here */}
        </div>
        </div>
    </form>
  );
}
