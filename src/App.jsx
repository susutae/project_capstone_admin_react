import { Admin, Resource } from 'react-admin'
import {
  Category as CategoryIcon,
  Inventory2 as ProductIcon,
  People as UserIcon,
  ReceiptLong as OrderIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material'
import { dataProvider } from './dataProvider'
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
    dataProvider={dataProvider}
    title="Capstone Commerce Admin"
    theme={{
      palette: {
        mode: 'light',
        primary: { main: '#155e75' },
        secondary: { main: '#d97706' },
        background: { default: '#f5f7f8' },
      },
      shape: { borderRadius: 10 },
      typography: { fontFamily: '"Inter", "Segoe UI", sans-serif' },
      components: {
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
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
