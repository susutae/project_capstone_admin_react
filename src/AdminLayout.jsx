import {
  AppBar,
  Layout,
  Menu,
  TitlePortal,
} from 'react-admin'
import {
  Category as CategoryIcon,
  DashboardRounded as DashboardIcon,
  Inventory2 as ProductIcon,
  People as UserIcon,
  ReceiptLong as OrderIcon,
  ShoppingBag as OrderItemIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

const Brand = () => (
  <Box className="admin-brand" aria-label="Capstone Commerce Admin">
    <Box className="admin-brand__mark">C</Box>
    <Box className="admin-brand__copy">
      <Typography className="admin-brand__name">Capstone</Typography>
      <Typography className="admin-brand__label">Commerce admin</Typography>
    </Box>
  </Box>
)

const CustomAppBar = () => (
  <AppBar className="admin-appbar" color="inherit">
    <Brand />
    <TitlePortal />
  </AppBar>
)

const CustomMenu = () => (
  <Menu className="admin-menu">
    <Menu.Item to="/" primaryText="Overview" leftIcon={<DashboardIcon />} />
    <Typography className="admin-menu__section">Commerce</Typography>
    <Menu.Item to="/orders" primaryText="Orders" leftIcon={<OrderIcon />} />
    <Menu.Item to="/order-items" primaryText="Order items" leftIcon={<OrderItemIcon />} />
    <Menu.Item to="/products" primaryText="Products" leftIcon={<ProductIcon />} />
    <Menu.Item to="/categories" primaryText="Categories" leftIcon={<CategoryIcon />} />
    <Typography className="admin-menu__section">Customers</Typography>
    <Menu.Item to="/users" primaryText="Users" leftIcon={<UserIcon />} />
    <Menu.Item to="/carts" primaryText="Carts" leftIcon={<CartIcon />} />
    <Menu.Item to="/cart-items" primaryText="Cart items" leftIcon={<OrderItemIcon />} />
  </Menu>
)

export const AdminLayout = (props) => (
  <Layout {...props} appBar={CustomAppBar} menu={CustomMenu} />
)
