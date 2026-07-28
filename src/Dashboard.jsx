import {
  Error,
  Loading,
  useGetList,
} from 'react-admin'
import {
  ArrowForwardRounded,
  Inventory2Rounded,
  PeopleAltRounded,
  ReceiptLongRounded,
  ShoppingCartRounded,
  TrendingUpRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const statusTone = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  completed: 'success',
  cancelled: 'error',
}

const StatCard = ({ icon, label, value, caption, tone }) => (
  <Card className={`stat-card stat-card--${tone}`}>
    <CardContent>
      <Box className="stat-card__top">
        <Box className="stat-card__icon">{icon}</Box>
        <TrendingUpRounded className="stat-card__trend" />
      </Box>
      <Typography className="stat-card__value">{value}</Typography>
      <Typography className="stat-card__label">{label}</Typography>
      <Typography className="stat-card__caption">{caption}</Typography>
    </CardContent>
  </Card>
)

export const Dashboard = () => {
  const users = useGetList('users', { pagination: { page: 1, perPage: 1000 } })
  const products = useGetList('products', { pagination: { page: 1, perPage: 1000 } })
  const carts = useGetList('carts', { pagination: { page: 1, perPage: 1000 } })
  const orders = useGetList('orders', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'created_at', order: 'DESC' },
  })

  if ([users, products, carts, orders].some((query) => query.isPending)) {
    return <Loading />
  }

  if ([users, products, carts, orders].some((query) => query.error)) {
    return <Error />
  }

  const orderRecords = orders.data || []
  const activeProducts = (products.data || []).filter((product) => product.is_active).length
  const completedOrders = orderRecords.filter((order) =>
    String(order.status).toLowerCase() === 'completed').length
  const revenue = orderRecords
    .filter((order) => String(order.status).toLowerCase() !== 'cancelled')
    .reduce((total, order) => total + Number(order.total_amount || 0), 0)
  const recentOrders = orderRecords.slice(0, 6)

  return (
    <Box className="dashboard">
      <Box className="dashboard__hero">
        <Box>
          <Typography className="dashboard__eyebrow">Store overview</Typography>
          <Typography component="h1" className="dashboard__title">Good to see you.</Typography>
          <Typography className="dashboard__subtitle">
            Here is what is happening across your commerce operation.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/orders/create"
          variant="contained"
          endIcon={<ArrowForwardRounded />}
          className="dashboard__cta"
        >
          Create order
        </Button>
      </Box>

      <Box className="stats-grid">
        <StatCard
          icon={<ReceiptLongRounded />}
          label="Total orders"
          value={orders.total || 0}
          caption={`${completedOrders} completed`}
          tone="blue"
        />
        <StatCard
          icon={<Inventory2Rounded />}
          label="Active products"
          value={activeProducts}
          caption={`${products.total || 0} products in catalog`}
          tone="orange"
        />
        <StatCard
          icon={<PeopleAltRounded />}
          label="Customers"
          value={users.total || 0}
          caption="Registered accounts"
          tone="violet"
        />
        <StatCard
          icon={<ShoppingCartRounded />}
          label="Open carts"
          value={carts.total || 0}
          caption={`${currency.format(revenue)} order value`}
          tone="green"
        />
      </Box>

      <Card className="dashboard-panel">
        <Box className="dashboard-panel__header">
          <Box>
            <Typography component="h2" className="dashboard-panel__title">Recent orders</Typography>
            <Typography className="dashboard-panel__subtitle">Latest customer activity</Typography>
          </Box>
          <Button component={Link} to="/orders" endIcon={<ArrowForwardRounded />}>
            View all
          </Button>
        </Box>

        {recentOrders.length === 0 ? (
          <Box className="dashboard-empty">
            <ReceiptLongRounded />
            <Typography>No orders yet</Typography>
            <Typography variant="body2">New orders will appear here.</Typography>
          </Box>
        ) : (
          <Box className="recent-orders">
            {recentOrders.map((order) => {
              const status = String(order.status || 'pending').toLowerCase()
              return (
                <Box
                  component={Link}
                  to={`/orders/${order.id}/show`}
                  className="recent-order"
                  key={order.id}
                >
                  <Box className="recent-order__identity">
                    <Box className="recent-order__avatar">
                      {String(order.customer_name || 'G').slice(0, 1).toUpperCase()}
                    </Box>
                    <Box>
                      <Typography className="recent-order__code">{order.order_code}</Typography>
                      <Typography className="recent-order__customer">
                        {order.customer_name || order.customer_email || 'Guest customer'}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack className="recent-order__meta" direction="row" alignItems="center" spacing={2}>
                    <Box>
                      <Typography className="recent-order__amount">
                        {currency.format(Number(order.total_amount || 0))}
                      </Typography>
                      <Typography className="recent-order__date">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                          : 'No date'}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      color={statusTone[status] || 'default'}
                      label={status}
                      className="status-chip"
                    />
                    <ArrowForwardRounded className="recent-order__arrow" />
                  </Stack>
                </Box>
              )
            })}
          </Box>
        )}
      </Card>

      <LinearProgress className="dashboard__accent" variant="determinate" value={72} />
    </Box>
  )
}
