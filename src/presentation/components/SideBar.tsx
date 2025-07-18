import { 
  Home, 
  FileText, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Logo_negro.png'

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeSection?: string;
}

const menuItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'quotes', icon: FileText, label: 'Cotizaciones' },
  { id: 'sales', icon: ShoppingCart, label: 'Ventas' },
  { id: 'customers', icon: Users, label: 'Clientes' },
  { id: 'reports', icon: BarChart3, label: 'Reportes' },
  { id: 'settings', icon: Settings, label: 'Configuración' }
];

export default function Sidebar({ isOpen, onToggle, onClose, activeSection }: SidebarProps) {

  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-white shadow-lg h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="py-4 lg:py-6 border-b border-[#e5e7eb]">
          <div className='flex h-20 items-center object-cover'>
            <img src={logo} className='w-full' alt="logo san luis" />
          </div>
        </div>
        
        <nav className="flex-1 p-3 lg:p-4 overflow-y-auto">
          <ul className="space-y-1 lg:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={()=>{navigate(`/${item.id}`); onToggle()}}
                    className={`w-full flex items-center space-x-2 lg:space-x-3 px-3 py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
                      activeSection === item.id
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-3 lg:p-4 border-t border-[#e5e7eb]">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold text-xs lg:text-sm">AD</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs lg:text-sm font-medium text-gray-800 truncate">Admin</p>
              <p className="text-xs text-gray-500 truncate">Administrador</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}