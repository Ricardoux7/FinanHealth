import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next/client';
import 'react-loading-skeleton/dist/skeleton.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { p } from 'framer-motion/client';


export default function Aside(){
  const [option, setOption] = useState('');
  const router = useRouter();


  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/home')) {
      setOption('home');
    } else if (currentPath.includes('/transactions')) {
      setOption('transactions');
    } else if (currentPath.includes('/budgets')) {
      setOption('budgets');
    } else if (currentPath.includes('/savings')) {
      setOption('savings');
    } else if (currentPath.includes('/stats')) {
      setOption('stats');
    } else {
      setOption('home');
    }  }, []);

    return (
    <aside className="bg-[#0C1322] w-[320px] h-full fixed top-0 left-0 flex-col items-center py-6 gap-6 border-r border-[#222F44] hidden md:flex">
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
        <button className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-semibold transition-colors duration-200 ${option === 'home' ? 'bg-green-500 text-white shadow-md' : 'text-white hover:bg-[#18213a]'}`} onClick={() => { setOption('home'); router.push('/home'); }}>
          <span className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v6.75M3 13.5v3.75A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25V13.5M3 13.5h18" /></svg>
          </span>
          Dashboard
        </button>
        <button className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-semibold transition-colors duration-200 ${option === 'transactions' ? 'bg-green-500 text-white shadow-md' : 'text-white hover:bg-[#18213a]'}`} onClick={() => { setOption('transactions'); router.push('/transactions'); }}>
          <span className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3A2.25 2.25 0 008.25 5.25V9m7.5 0v10.5A2.25 2.25 0 0113.5 21h-3A2.25 2.25 0 018.25 19.5V9m7.5 0H8.25m7.5 0a2.25 2.25 0 012.25 2.25v7.5A2.25 2.25 0 0113.5 21h-3A2.25 2.25 0 018.25 19.5v-7.5A2.25 2.25 0 0110.5 9h3z" /></svg>
          </span>
          Transactions
        </button>
        <button className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-semibold transition-colors duration-200 ${option === 'budgets' ? 'bg-green-500 text-white shadow-md' : 'text-white hover:bg-[#18213a]'}`} onClick={() => { setOption('budgets'); router.push('/budgets'); }}>
          <span className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </span>
          Budgets
        </button>
        <button className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-semibold transition-colors duration-200 ${option === 'savings' ? 'bg-green-500 text-white shadow-md' : 'text-white hover:bg-[#18213a]'}`} onClick={() => { setOption('savings'); router.push('/savings'); }}>
          <span className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25M6.364 6.364l-1.591 1.591M3 12h2.25M6.364 17.636l-1.591-1.591M12 21v-2.25M17.636 17.636l1.591-1.591M21 12h-2.25M17.636 6.364l1.591 1.591" /><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </span>
          Savings
        </button>
        <button className={`cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left font-semibold transition-colors duration-200 ${option === 'stats' ? 'bg-green-500 text-white shadow-md' : 'text-white hover:bg-[#18213a]'}`} onClick={() => { setOption('stats'); router.push('/stats'); }}>
          <span className="w-5 h-5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 17.25V21h3.75M3 17.25A9 9 0 0112 3a9 9 0 018.25 14.25M3 17.25h3.75M21 21v-3.75M21 21h-3.75" /></svg>
          </span>
          Stats
        </button>
      </nav>
      <div className="mt-auto mb-2 text-center text-xs text-gray-500 w-full">
        <span>&copy; {new Date().getFullYear()} FinTrack</span>
      </div>
    </aside>
  );
} 

export function SkeletonMenu(){

  return (
    <SkeletonTheme baseColor="#c5cbd6" highlightColor="#444">
      <Skeleton count={1} height={20} width={200} circle={false}/>
    </SkeletonTheme>
  )
}

export function Header(){
  const [userInfo, setUserInfo] = useState<{ id: string, username: string, email: string }| null>(null);
    const router = useRouter();

    const logOut = () => {
    deleteCookie('session_token');
    router.push('/login');
  }
  async function fetchUserInfo() {
try {
  const response = await fetch('/api/auth/userInfo');
  const data = await response.json();
  if (response.ok) {
    setUserInfo(data);
  } else {
    alert('Error fetching user info');
  }
} catch (error) {
  alert('Error fetching user info');
}}

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <header className="bg-[#0F1729] h-20 top-0 w-full flex items-center md:justify-end  justify-between border-b border-[#222F44]">
      <button className="hover:bg-purple-600 h-5 transition-colors duration-300 border-none rounded-md px-1 py-5 text-white items-center justify-center flex md:hidden ml-4 " >
        <img src="/menu.svg" alt="" className="w-5"/>
      </button>
      <details className=" relative mr-4 group ">
        <summary className="rounded-4xl p-4 bg-green-500 w-8 h-8 flex items-center justify-center ml-2 text-white font-bold mr-4 select-none cursor-pointer">
          {userInfo ? (
            <span>{userInfo.username.substring(0, 1).toUpperCase()}</span>
          ) : (
            <Skeleton count={1} height={20} width={100} circle={false}/>
          )}
        </summary>
        <div className="absolute right-4 mt-2 bg-[#0C1322] rounded-md shadow-lg py-2 z-10 w-62.5 border-b border-[#222F44]">
          <div className='flex flex-row border-b border-[#222F44]'>
            <span className='rounded-4xl p-4 bg-green-500 w-8 h-8 flex items-center justify-center ml-2 text-white font-bold mr-2'>{userInfo ? userInfo.username.substring(0, 1).toUpperCase() : <Skeleton count={1} height={20} width={100} circle={false}/>}</span>
            <p className="block pr-4 py-2 text-sm text-white truncate font-bold">{userInfo ? userInfo.email : <Skeleton count={1} height={20} width={100} circle={false}/>}</p>
          </div>
          <p className='text-white px-4 py-2 text-sm'>Personal Account</p>
          <button onClick={() => logOut()} className="block w-full text-left px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-[#e53e3e] cursor-pointer">Log Out</button>
        </div>
      </details>
    </header>
  )
}

export function AddTransaction() {
  const [userInfo, setUserInfo] = useState<{ id: string, username: string, email: string, categories: string[] } | null>(null);
  const [option, setOption] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [budgets, setBudgets] = useState<{ name: string; limit: number; currentSpent: number; startDate: string; endDate: string | null; status: string }[]>([]);
  const [isBudget, setIsBudget] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [Operation, setOperation] = useState('');
  const [CategoryType, setCategoryType] = useState('');

  useEffect(() => {
    async function showData() {
      try {
        const response = await fetch('/api/auth/userInfo');
        const data = await response.json();
        if (response.ok) {
          setUserInfo(data);
        } else {
          alert('Error fetching user info');
        }
      } catch (error) {
        alert('Error fetching user info');
      }
    }
    showData();
  }, []);

  useEffect(() => {
    if (userInfo && userInfo.id && userInfo.id !== '') {
      showBudgets(userInfo.id);
    }
  }, [userInfo]);

  const showBudgets = async function(userId: String){
    try {
      const response = await fetch('/api/actions/budget?userId=' + userId);
      const data = await response.json();
      if (response.ok) {
        setBudgets(data.data);
      } else {
        alert('Error fetching budgets');
      }
    } catch (error) {
      alert('Error fetching budgets');
    }
  }


  async function makeTransaction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userInfo) {
      setMessage('User info not loaded');
      return;
    }
    const userId = userInfo.id;
    const selectedCategory = category === 'add' ? newCategory : category;
    if (option === 'income') {
      try {
        const response = await fetch('/api/actions/movements/incomes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory, amount, date, source, type: CategoryType })
        });
        if (response.ok) {
          alert('Movement added successfully');
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || 'Error adding movement');
        }
      } catch (error) {
        setMessage('Error adding movement');
      }
    } else if (option === 'expense') {
      try {
        const response = await fetch('/api/actions/movements/expenses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: selectedCategory, amount, date, source, type: CategoryType })
        });
        console.log('typeValue:', CategoryType);
        let updateOk = true;
        if (CategoryType === 'budget') {
          const budgetsRes = await fetch('/api/actions/budget?userId=' + userId);
          const budgetsData = await budgetsRes.json();
          const budget = budgetsData.data.find((b: any) => b.name === category);
          if (budget) {
            const updateBudget = await fetch('/api/actions/budget', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ budgetId: budget._id, updateData: { currentSpent: (budget.currentSpent || 0) + amount } })
          });
            updateOk = updateBudget.ok;
            setIsBudget(true);
          }
        }
        if (response.ok && updateOk) {
          alert('Movement added successfully');
        } else {
          const errorData = await response.json();
          setMessage(errorData.message || 'Error adding movement');
          console.log('hola')
        }
      } catch (error) {
        setMessage('Error adding movement');

      }
    }
  }

  const categoryExists = category === 'add' && userInfo && userInfo.categories && userInfo.categories.some(cat => cat.toLowerCase() === newCategory.trim().toLowerCase());
  const isSuccess = message && message.toLowerCase().includes('success');
  const isError = message && !isSuccess;

  return (
    <section className='bg-[#0F1729] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  h-auto flex flex-col items-center justify-center z-20 w-120 rounded-md border border-[#222F44] p-5'>
      <p className='text-white font-bold my-2'>Add Transaction</p>
      {message && (
        <div
          className={`w-full mb-4 px-4 py-2 rounded-md text-center font-semibold transition-all duration-300
            ${isSuccess ? 'bg-green-100 text-green-800 border border-green-400' : ''}
            ${isError ? 'bg-red-100 text-red-800 border border-red-400' : ''}
          `}
        >
          {message}
        </div>
      )}
      <form onSubmit={makeTransaction} className='w-full'>
        <section className='flex flex-row gap-2 justify-between bg-[#1D283A] rounded-md border border-[#222F44] p-1 mb-5 text-center'>
          <button
            type="button"
            onClick={() => setOption('income')}
            className={`cursor-pointer relative overflow-hidden w-1/2 py-2 rounded-md font-bold text-white transition-colors duration-300
            before:absolute before:top-0 before:right-0 before:h-full before:w-full before:z-0
            before:transition-all before:duration-500
            ${option === 'income' ? 'before:bg-green-500 before:scale-x-100' : 'before:bg-green-500 before:scale-x-0'}
            before:origin-right
            `}>
            <span className="relative z-10">Income</span>
          </button>
          <button
            type="button"
            onClick={() => setOption('expense')}
            className={`cursor-pointer relative overflow-hidden w-1/2 py-2 rounded-md font-bold text-white transition-colors duration-300
              before:absolute before:top-0 before:left-0 before:h-full before:w-full before:z-0
              before:transition-all before:duration-500
              ${option === 'expense' ? 'before:bg-red-500 before:scale-x-100' : 'before:bg-red-500 before:scale-x-0'}
              before:origin-left
            `}>
            <span className="relative z-10">Expense</span>
          </button>
        </section>
        <section className='w-full flex flex-col gap-2'>
          <p className='text-white font-bold'>Amount</p>
          <input type="number" placeholder="$0.00" min={0.10} step={0.10} onChange={e => setAmount(Number(e.target.value))} className='border rounded-md border-[#222F44] focus:ring-3 focus:ring-green-500 text-white pl-2 h-8 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'  />
          <p className='text-white font-bold'>Category</p>
          {option === 'expense' && (
            <>
              <p className='text-red-500 text-sm italic'>Select the category of your expense or add a new one</p>
              <section className='flex flex-row gap-2 text-white'>
                <input type="radio" name="expenseType" id="budget" value="budget" checked={CategoryType === 'budget'} onChange={e => setCategoryType(e.target.value)} />
                <label htmlFor="budget" className="text-white">Budget</label>
                <input type="radio" name="expenseType" id="casual" value="casual" checked={CategoryType === 'casual'} onChange={e => setCategoryType(e.target.value)} />
                <label htmlFor="casual">Casual</label>
              </section>
            </>
          )}
          <select
            name="categories"
            id="categories"
            className="border rounded-md border-[#222F44] focus:ring-3 focus:ring-green-500 text-white bg-[#1a2236] pl-2 h-8 mb-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="" className="bg-[#222F44] color-[#c5cbd6] text-gray-400" disabled={true}>Select category</option>
            {option === 'expense' && CategoryType === 'budget' ? (
              budgets && budgets.length > 0 ? (
                budgets.map((budget, index) => (
                  <option
                    key={index}
                    value={budget.name}
                    className="bg-[#1a2236] text-green-400 hover:bg-green-500 hover:text-black"
                  >
                    {budget.name}
                  </option>
                ))
              ) : (
                <option
                  value=""
                  className="bg-[#222F44] color-[#c5cbd6] text-gray-400"
                  disabled={true}
                >
                  No budgets available
                </option>
              )
            ) : (
              userInfo && Array.isArray(userInfo.categories) && userInfo.categories.length > 0 ? (
                userInfo.categories.map((cat, index) => (
                  <option
                    key={index}
                    value={cat}
                    className="bg-[#1a2236] text-green-400 hover:bg-green-500 hover:text-black"
                  >
                    {cat}
                  </option>
                ))
              ) : (
                <option
                  value=""
                  className="bg-[#222F44] color-[#c5cbd6] text-gray-400"
                  disabled={true}
                >
                  No categories available
                </option>
              )
            )}
            <option
              value="add"
              className="bg-[#222F44] text-green-400 italic"
              style={{ backgroundColor: '#222F44', color: '#16A249', fontStyle: 'italic' }}
            >
              Add new category
            </option>
          </select>
          {category === 'add' && (
            <>
              <input type="text" placeholder="Enter category" value={newCategory} onChange={e => setNewCategory(e.target.value)} className='border rounded-md border-[#222F44] focus:ring-3 focus:ring-green-500 text-white pl-2 h-8' />
              {categoryExists && (
                <p className='text-red-500 text-sm italic'>Category already exists</p>
              )}
            </>
          )}
          <p className='text-white font-bold'>Source</p>
          <input type="text" placeholder="Enter source" value={source} onChange={e => setSource(e.target.value)} className='border rounded-md border-[#222F44] focus:ring-3 focus:ring-green-500 text-white pl-2 h-8' />
          <p className='text-white font-bold'>Date</p>
          <input 
            type="date" 
            name="maxDate"
            className="text-white bg-[#1a2236] border border-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 mt-5 [&::-webkit-calendar-picker-indicator]:invert-[1] "
            max={new Date().toISOString().split('T')[0]} 
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </section>
        <button type="submit" className='text-white font-bold bg-green-500 rounded-md p-2 mt-2 w-full' disabled={!!categoryExists}>Add</button>
      </form>
    </section>
  );
}