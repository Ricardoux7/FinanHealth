import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useRouter } from 'next/navigation';
import 'react-loading-skeleton/dist/skeleton.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MOBILE_MENU_EVENT = 'fintrack:toggle-mobile-menu';

export default function Aside() {
  const [option, setOption] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/home')) setOption('home');
    else if (currentPath.includes('/transactions')) setOption('transactions');
    else if (currentPath.includes('/budgets')) setOption('budgets');
    else if (currentPath.includes('/savings')) setOption('savings');
    else if (currentPath.includes('/stats')) setOption('stats');
    else setOption('home');
  }, []);

  useEffect(() => {
    const handleToggle = () => setMobileOpen(open => !open);
    window.addEventListener(MOBILE_MENU_EVENT, handleToggle);
    return () => window.removeEventListener(MOBILE_MENU_EVENT, handleToggle);
  }, []);

  const handleNavigate = (path: string, key: string) => {
    setOption(key);
    setMobileOpen(false);
    router.push(path);
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <motion.aside
        initial={{ opacity: 0, x: -18 }}
        animate={mobileOpen ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={`bg-[#0C1322] w-[320px] h-full fixed top-0 left-0 flex-col items-center py-6 gap-6 border-r border-[#222F44] z-50 transform transition-transform duration-300 md:flex ${mobileOpen ? 'flex translate-x-0' : 'hidden -translate-x-full md:translate-x-0'}`}
      >
      <section className="flex flex-row items-center gap-3 mb-8">
        <div className="bg-green-500 rounded-xl p-2 flex items-center justify-center w-12 h-12">
          <img src="/wallet2.svg" alt="Logo" className="w-8 h-8" />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-bold text-xl text-white leading-tight">FinTrack</h1>
          <p className="text-gray-400 text-xs">Personal Finance</p>
        </div>
      </section>
      <nav className="flex flex-col gap-2 w-full px-4 flex-1">
        {[
          { key: 'home', label: 'Dashboard', path: '/home', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v6.75M3 13.5v3.75A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25V13.5M3 13.5h18" /> },
          { key: 'transactions', label: 'Transactions', path: '/transactions', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /> },
          { key: 'budgets', label: 'Budgets', path: '/budgets', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /> },
          { key: 'savings', label: 'Savings', path: '/savings', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
          { key: 'stats', label: 'Stats', path: '/stats', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.25V21h3.75M3 17.25A9 9 0 0112 3a9 9 0 018.25 14.25M3 17.25h3.75M21 21v-3.75M21 21h-3.75" /> },
        ].map(({ key, label, path, icon }, index) => (
          <motion.button
            key={key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.18, delay: 0.04 * index }}
            className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-semibold transition-colors duration-200 ${option === key ? 'bg-green-500 text-white shadow-md' : 'text-white hover:bg-[#18213a]'}`}
            onClick={() => handleNavigate(path, key)}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                {icon}
              </svg>
            </span>
            {label}
          </motion.button>
        ))}
      </nav>
      <div className="mt-auto mb-2 text-center text-xs text-gray-500 w-full">
        <span>&copy; {new Date().getFullYear()} FinTrack</span>
      </div>
      </motion.aside>
    </>
  );
}

export function SkeletonMenu() {
  return (
    <SkeletonTheme baseColor="#c5cbd6" highlightColor="#444">
      <Skeleton count={1} height={20} width={200} />
    </SkeletonTheme>
  );
}

export function Header() {
  const [userInfo, setUserInfo] = useState<{ id: string; username: string; email: string } | null>(null);
  const router = useRouter();

  const logOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await fetch('/api/auth/userInfo');
        const data = await response.json();
        if (response.ok) setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    }
    fetchUserInfo();
  }, []);

  return (
    <header className="bg-[#0F1729] h-20 top-0 w-full flex items-center md:justify-end justify-between border-b border-[#222F44]">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event(MOBILE_MENU_EVENT))}
        className="hover:bg-purple-600 h-5 transition-colors duration-300 border-none rounded-md px-1 py-5 text-white items-center justify-center flex md:hidden ml-4"
      >
        <img src="/menu.svg" alt="" className="w-5" />
      </button>
      <details className="relative mr-4 group">
        <summary className="rounded-4xl p-4 bg-green-500 w-8 h-8 flex items-center justify-center ml-2 text-white font-bold mr-4 select-none cursor-pointer">
          {userInfo ? (
            <span>{userInfo.username.substring(0, 1).toUpperCase()}</span>
          ) : (
            <Skeleton count={1} height={20} width={20} />
          )}
        </summary>
        <div className="absolute right-4 mt-2 bg-[#0C1322] rounded-md shadow-lg py-2 z-10 w-62 border border-[#222F44]">
          <div className="flex flex-row border-b border-[#222F44] pb-2 px-2 gap-2 items-center">
            <span className="rounded-full bg-green-500 w-8 h-8 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {userInfo ? userInfo.username.substring(0, 1).toUpperCase() : '?'}
            </span>
            <p className="text-sm text-white truncate font-bold">{userInfo ? userInfo.email : '...'}</p>
          </div>
          <p className="text-white px-4 py-2 text-sm">Personal Account</p>
          <button
            onClick={() => logOut()}
            className="block w-full text-left px-4 py-2 text-sm text-white bg-red-500 rounded-b-md hover:bg-red-600 cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </details>
    </header>
  );
}

export function AddTransaction() {
  const [userInfo, setUserInfo] = useState<{ id: string; username: string; email: string; categories: string[] } | null>(null);
  const [option, setOption] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [budgets, setBudgets] = useState<{ _id: string; name: string; limit: number; currentSpent: number; status: string }[]>([]);
  const [CategoryType, setCategoryType] = useState('');

  useEffect(() => {
    async function showData() {
      try {
        const response = await fetch('/api/auth/userInfo');
        const data = await response.json();
        if (response.ok) setUserInfo(data);
      } catch (error) {
        console.error('Error fetching user info', error);
      }
    }
    showData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      fetch('/api/actions/budget')
        .then(r => r.json())
        .then(data => setBudgets(data.data || []))
        .catch(() => {});
    }
  }, [userInfo]);

  async function makeTransaction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userInfo) { setMessage('User info not loaded'); return; }
    const selectedCategory = category === 'add' ? newCategory : category;

    if (option === 'income') {
      try {
        const response = await fetch('/api/actions/movements/incomes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory, amount, date, source }),
        });
        if (response.ok) {
          setMessage('Income added successfully');
        } else {
          const err = await response.json();
          setMessage(err.message || 'Error adding income');
        }
      } catch {
        setMessage('Error adding income');
      }
    } else if (option === 'expense') {
      try {
        const response = await fetch('/api/actions/movements/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory, amount, date, source, type: CategoryType }),
        });
        if (response.ok) {
          if (CategoryType === 'budget') {
            const budget = budgets.find(b => b.name === category);
            if (budget) {
              await fetch('/api/actions/budget', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budgetId: budget._id, updateData: { currentSpent: (budget.currentSpent || 0) + amount } }),
              });
            }
          }
          setMessage('Expense added successfully');
        } else {
          const err = await response.json();
          setMessage(err.message || 'Error adding expense');
        }
      } catch {
        setMessage('Error adding expense');
      }
    }
  }

  const categoryExists = category === 'add' && userInfo?.categories?.some(
    cat => cat.toLowerCase() === newCategory.trim().toLowerCase()
  );
  const isSuccess = message.toLowerCase().includes('success');
  const isError = !!message && !isSuccess;

  return (
    <section className="bg-[#0F1729] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto flex flex-col items-center justify-center z-20 w-120 rounded-md border border-[#222F44] p-5">
      <p className="text-white font-bold my-2">Add Transaction</p>
      {message && (
        <div className={`w-full mb-4 px-4 py-2 rounded-md text-center font-semibold ${isSuccess ? 'bg-green-100 text-green-800 border border-green-400' : 'bg-red-100 text-red-800 border border-red-400'}`}>
          {message}
        </div>
      )}
      <form onSubmit={makeTransaction} className="w-full">
        <section className="flex flex-row gap-2 justify-between bg-[#1D283A] rounded-md border border-[#222F44] p-1 mb-5 text-center">
          {['income', 'expense'].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => setOption(opt)}
              className={`cursor-pointer relative overflow-hidden w-1/2 py-2 rounded-md font-bold text-white transition-colors duration-300 before:absolute before:top-0 before:h-full before:w-full before:z-0 before:transition-all before:duration-500 ${opt === 'income' ? `before:bg-green-500 before:right-0 ${option === 'income' ? 'before:scale-x-100' : 'before:scale-x-0'} before:origin-right` : `before:bg-red-500 before:left-0 ${option === 'expense' ? 'before:scale-x-100' : 'before:scale-x-0'} before:origin-left`}`}
            >
              <span className="relative z-10 capitalize">{opt}</span>
            </button>
          ))}
        </section>
        <section className="w-full flex flex-col gap-2">
          <p className="text-white font-bold">Amount</p>
          <input type="number" placeholder="$0.00" min={0.10} step={0.10} onChange={e => setAmount(Number(e.target.value))} className="border rounded-md border-[#222F44] focus:ring-3 focus:ring-green-500 text-white pl-2 h-8 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          <p className="text-white font-bold">Category</p>
          {option === 'expense' && (
            <section className="flex flex-row gap-2 text-white text-sm">
              {['budget', 'casual'].map(type => (
                <label key={type} className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" name="expenseType" value={type} checked={CategoryType === type} onChange={e => setCategoryType(e.target.value)} />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </section>
          )}
          <select name="categories" className="border rounded-md border-[#222F44] focus:ring-3 focus:ring-green-500 text-white bg-[#1a2236] pl-2 h-8 mb-2" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="" disabled>Select category</option>
            {option === 'expense' && CategoryType === 'budget' ? (
              budgets.length > 0 ? budgets.map((b, i) => <option key={i} value={b.name} className="bg-[#1a2236]">{b.name}</option>)
              : <option value="" disabled>No budgets available</option>
            ) : (
              userInfo?.categories?.length ? userInfo.categories.map((cat, i) => <option key={i} value={cat} className="bg-[#1a2236]">{cat}</option>)
              : <option value="" disabled>No categories available</option>
            )}
            <option value="add" className="bg-[#222F44] text-green-400 italic">+ Add new category</option>
          </select>
          {category === 'add' && (
            <>
              <input type="text" placeholder="Enter category" value={newCategory} onChange={e => setNewCategory(e.target.value)} className="border rounded-md border-[#222F44] focus:ring-3 focus:ring-green-500 text-white pl-2 h-8" />
              {categoryExists && <p className="text-red-500 text-sm italic">Category already exists</p>}
            </>
          )}
          <p className="text-white font-bold">Source</p>
          <input type="text" placeholder="Enter source" value={source} onChange={e => setSource(e.target.value)} className="border rounded-md border-[#222F44] focus:ring-3 focus:ring-green-500 text-white pl-2 h-8" />
          <p className="text-white font-bold">Date</p>
          <input type="date" className="text-white bg-[#1a2236] border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 [&::-webkit-calendar-picker-indicator]:invert-[1]" max={new Date().toISOString().split('T')[0]} value={date} onChange={e => setDate(e.target.value)} />
        </section>
        <button type="submit" className="text-white font-bold bg-green-500 rounded-md p-2 mt-2 w-full disabled:opacity-50" disabled={!!categoryExists}>Add</button>
      </form>
    </section>
  );
}
