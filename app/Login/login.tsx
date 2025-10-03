import {
  AtSymbolIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../ui/button';

export default function LoginForm() {
  return (
<div className="min-h-full flex flex-col items-center px-6 py-6">
  <h2 className="text-center text-2xl font-bold text-black m-0">
    Registrate a nuestro<br />Newsletter
  </h2>

  <div className="w-full max-w-[80%] md:max-w-[50%] border rounded-md p-4">
    <img
      src="fotos/image.png"
      alt="Your Company"
      className="w-full h-auto object-contain rounded-md mb-4"
    />
    <div className="flex justify-center">
      <a
        href="https://substack.com/@fundacionprobuenosaires?utm_source=global-search"
        className="text-white text-center px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-md"
        target="_blank"
        rel="noopener noreferrer"
      >
        Newsletter
      </a>
    </div>
  </div>
</div>
  );
}
