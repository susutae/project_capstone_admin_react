import { Admin, Resource } from 'react-admin'
import {
  Category as CategoryIcon,
  Inventory2 as ProductIcon,
  People as UserIcon,
  ReceiptLong as OrderIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material'
import { dataProvider } from './dataProvider'
import { authProvider } from './authProvider'
import { AdminLayout } from './AdminLayout'
import { Dashboard } from './Dashboard'
import { LoginPage } from './LoginPage'
import {
  CartCreate,
  CartEdit,
  CartItemCreate,
  CartItemEdit,
  CartItemList,
  CartList,
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  OrderCreate,
  OrderEdit,
  OrderItemCreate,
  OrderItemList,
  OrderList,
  OrderShow,
  ProductCreate,
  ProductEdit,
  ProductList,
  UserCreate,
  UserEdit,
  UserList,
} from './resources'
import './App.css'

const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    dashboard={Dashboard}
    layout={AdminLayout}
    loginPage={LoginPage}
    title="Capstone Commerce Admin"
    theme={{
      palette: {
        mode: 'light',
        primary: { main: '#2563eb', dark: '#1d4ed8', light: '#dbeafe' },
        secondary: { main: '#f97316', dark: '#ea580c', light: '#ffedd5' },
        background: { default: '#f5f7fb', paper: '#ffffff' },
        text: { primary: '#172033', secondary: '#687386' },
        divider: '#e8ecf3',
      },
      shape: { borderRadius: 14 },
      typography: {
        fontFamily: '"Inter", "Segoe UI", sans-serif',
        h5: { fontWeight: 750, letterSpacing: '-0.025em' },
        button: { fontWeight: 700, textTransform: 'none' },
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
              border: '1px solid #e8ecf3',
              boxShadow: '0 8px 30px rgba(31, 42, 68, 0.06)',
            },
          },
        },
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: { root: { borderRadius: 10, minHeight: 40 } },
        },
        MuiTextField: {
          defaultProps: { variant: 'outlined' },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 10,
              background: '#fff',
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#94a3b8' },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              background: '#f8fafc',
              color: '#64748b',
              fontWeight: 750,
              whiteSpace: 'nowrap',
            },
            root: { borderColor: '#eef1f6' },
          },
        },
        MuiChip: { styleOverrides: { root: { fontWeight: 700 } } },
      },
    }}
  >
    <Resource name="users" list={UserList} create={UserCreate} edit={UserEdit} icon={UserIcon} recordRepresentation="email" />
    <Resource name="categories" list={CategoryList} create={CategoryCreate} edit={CategoryEdit} icon={CategoryIcon} recordRepresentation="name" />
    <Resource name="products" list={ProductList} create={ProductCreate} edit={ProductEdit} icon={ProductIcon} recordRepresentation="title" />
    <Resource name="carts" list={CartList} create={CartCreate} edit={CartEdit} icon={CartIcon} />
    <Resource name="cart-items" list={CartItemList} create={CartItemCreate} edit={CartItemEdit} options={{ label: 'Cart Items' }} />
    <Resource name="orders" list={OrderList} create={OrderCreate} edit={OrderEdit} show={OrderShow} icon={OrderIcon} recordRepresentation="order_code" />
    <Resource name="order-items" list={OrderItemList} create={OrderItemCreate} options={{ label: 'Order Items' }} />
  </Admin>
)

export default App
