import { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Setup our axios network instance with the secure Authorization header
  const api = axios.create({
    baseURL: 'https://task-manager-xmq4.onrender.com/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  // 1. READ: Fetch tasks from the database on component load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks');
        setTasks(response.data);
      } catch (err) {
        console.error('Database connection error:', err); // Clean use of 'err'
        setError('System engine failed to retrieve tasks.');
      }
    };

    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Safely isolated initialization vector

  // 2. CREATE: Submit a new task document to MongoDB Atlas
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await api.post('/tasks', { title, description });
      setTasks([response.data, ...tasks]); 
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Task execution write rejection:', err); // Clean use of 'err'
      setError('Failed to write new task to database.');
    }
  };

  // 3. UPDATE: Cycle status through standard engineering states
  const handleToggleStatus = async (id, currentStatus) => {
    let nextStatus = 'Todo';
    if (currentStatus === 'Todo') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Completed';

    try {
      const response = await api.put(`/tasks/${id}`, { status: nextStatus });
      setTasks(tasks.map(t => t._id === id ? response.data : t));
    } catch (err) {
      console.error('Data modification stream failure:', err); // Clean use of 'err'
      setError('Status modification operation failed.');
    }
  };

  // 4. DELETE: Purge a task record from the cluster architecture
  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id)); 
    } catch (err) {
      console.error('Database purge operation denied:', err); // Clean use of 'err'
      setError('Task deletion command rejected by cluster.');
    }
  };

  return (
    <div className="max-w-6xl w-full mx-auto p-6 md:p-8 grow flex flex-col gap-8">
      {/* User Greeting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Operator: <span className="text-amber-500">{user?.username}</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">Mission Command Center Dashboard</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900 text-red-400 text-xs font-semibold p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Create Task Form Panel */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg lg:sticky lg:top-24">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Allocate New Task
          </h3>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Task Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Database architecture design"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Technical Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Map out document relationship structures..."
                rows="3"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold py-2.5 rounded-md text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Push to Cluster
            </button>
          </form>
        </div>

        {/* Dynamic Task Viewport Grid Panel */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-300 mb-6 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Active Task Register ({tasks.length})
          </h3>

          {tasks.length === 0 ? (
            <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center text-sm text-zinc-500">
              No active metrics currently mapped to this operative segment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div 
                  key={task._id} 
                  className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between shadow-md group hover:border-zinc-700 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-bold text-white tracking-tight wrap-break-word max-w-[80%]">{task.title}</h4>
                      <button
                        onClick={() => handleToggleStatus(task._id, task.status)}
                        className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          task.status === 'Completed' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/60 hover:bg-emerald-900/20' :
                          task.status === 'In Progress' ? 'bg-blue-950/40 text-blue-400 border-blue-900/60 hover:bg-blue-900/20' :
                          'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                        }`}
                      >
                        {task.status}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-3 wrap-break-word mb-6">{task.description || 'No log details added.'}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-950 pt-3 text-[10px] text-zinc-500">
                    <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-zinc-500 hover:text-red-400 font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Purge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}