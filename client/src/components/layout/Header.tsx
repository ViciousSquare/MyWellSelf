import { Link } from "wouter";
import { User } from "@/lib/types";
import SampleDataLoader from "@/components/SampleDataLoader";

interface HeaderProps {
  user?: User;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <div className="bg-primary-500 text-white p-1.5 rounded-md mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                      <path d="M3.22 12H9.5l.5-1 2 4 2-6 1.5 3h4.78"/>
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold text-neutral-800 font-heading">My Well Self</h1>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sample Data Loader Button */}
            <SampleDataLoader />
            
            <div className="flex items-center">
              <button className="p-1 rounded-full text-neutral-500 hover:text-neutral-600 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                </svg>
              </button>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-medium">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    {user?.lastName?.[0] || ''}
                  </div>
                  <span className="ml-2 text-sm font-medium text-neutral-700 hidden sm:block">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
