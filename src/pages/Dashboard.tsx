import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService } from '../firebase/services';
import { where, orderBy } from 'firebase/firestore';
import { Project, Task } from '../types';
import { cn } from '../utils/cn';
import { seedDatabase } from '../utils/seedData';

const data = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 7 },
  { name: 'Wed', tasks: 5 },
  { name: 'Thu', tasks: 12 },
  { name: 'Fri', tasks: 9 },
  { name: 'Sat', tasks: 3 },
  { name: 'Sun', tasks: 2 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export const Dashboard: React.FC = () => {
  const { profile, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubProjects = firestoreService.subscribeToCollection(
      'projects',
      [where('ownerId', '==', user.uid)],
      (items) => setProjects(items as Project[])
    );

    const unsubTasks = firestoreService.subscribeToCollection(
      'tasks',
      [where('ownerId', '==', user.uid), orderBy('createdAt', 'desc')],
      (items) => setTasks(items as Task[])
    );

    setLoading(false);
    return () => {
      unsubProjects();
      unsubTasks();
    };
  }, [user]);

  const stats = [
    { name: 'Total Projects', value: projects.length.toString(), icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Completed Tasks', value: tasks.filter(t => t.status === 'done').length.toString(), icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Active Tasks', value: tasks.filter(t => t.status !== 'done').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Urgent Tasks', value: tasks.filter(t => t.priority === 'urgent').length.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const handleSeed = async () => {
    if (!user) return;
    setLoading(true);
    await seedDatabase(user.uid);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {projects.length === 0 && !loading && (
        <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Welcome to your new workspace!</h2>
            <p className="text-indigo-100 mb-6 max-w-md">It looks like you don't have any projects yet. Get started by seeding some sample data or create your first project manually.</p>
            <div className="flex gap-4">
              <button 
                onClick={handleSeed}
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                Seed Sample Data
              </button>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20">
            <TrendingUp size={240} />
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hello, {profile?.displayName || 'User'}! 👋</h1>
          <p className="text-gray-500">Here's what's happening with your projects today.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp size={14} />
                <span>+12%</span>
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Productivity */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Weekly Productivity</h3>
            <select className="text-sm border-none bg-gray-50 rounded-lg px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorTasks)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Task Distribution</h3>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length || 1 },
                    { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length || 1 },
                    { name: 'Review', value: tasks.filter(t => t.status === 'review').length || 1 },
                    { name: 'Done', value: tasks.filter(t => t.status === 'done').length || 1 },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {['To Do', 'In Progress', 'Review', 'Done'].map((status, i) => (
              <div key={status} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-sm text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900">Recent Activities</h3>
          <Link to="/activity" className="text-indigo-600 text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="space-y-6">
          {tasks.slice(0, 5).map((task, i) => (
            <div key={task.id} className="flex gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                i % 2 === 0 ? "bg-indigo-50 text-indigo-600" : "bg-green-50 text-green-600"
              )}>
                {i % 2 === 0 ? <Plus size={20} /> : <CheckCircle size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">
                  {i % 2 === 0 ? `Created task "${task.title}"` : `Completed task "${task.title}"`}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
              </div>
              <div className="text-sm font-medium text-gray-400">#TF-{i + 101}</div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">No recent activities found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
