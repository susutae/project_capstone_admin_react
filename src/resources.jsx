import {
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  DateField,
  DeleteButton,
  Edit,
  EditButton,
  EmailField,
  FunctionField,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  required,
  SearchInput,
  SelectInput,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  UrlField,
} from 'react-admin'
import { hash } from 'bcryptjs'

const listFilters = [<SearchInput key="q" source="q" alwaysOn />]
const orderItemFilters = [
  <NumberInput key="order_id" source="order_id" label="Order ID" alwaysOn min={1} />,
]
const timestamps = (
  <>
    <DateField source="created_at" showTime />
    <DateField source="updated_at" showTime />
  </>
)
const rowActions = (
  <>
    <EditButton />
    <DeleteButton mutationMode="pessimistic" />
  </>
)

const transformUser = async (record, { creating = false } = {}) => {
  const { password, ...user } = record

  if (password) {
    user.password_hash = await hash(password, 12)
  } else if (creating) {
    throw new Error('Password is required.')
  }

  return user
}

const UserForm = ({ creating = false }) => (
  <SimpleForm>
    <TextInput source="full_name" validate={required()} fullWidth />
    <TextInput source="email" type="email" validate={required()} fullWidth />
    <TextInput
      source="password"
      type="password"
      label={creating ? 'Password' : 'New password'}
      validate={creating ? required() : undefined}
      helperText={creating
        ? 'Hashed with bcrypt before it is sent to the API.'
        : 'Leave blank to keep the current password.'}
      autoComplete="new-password"
      fullWidth
    />
    <SelectInput source="membership_tier" validate={required()} choices={[
      { id: 'standard', name: 'Standard' },
      { id: 'silver', name: 'Silver' },
      { id: 'gold', name: 'Gold' },
      { id: 'platinum', name: 'Platinum' },
    ]} />
    <NumberInput source="discount_percentage" min={0} max={100} />
  </SimpleForm>
)

export const UserList = () => (
  <List filters={listFilters} sort={{ field: 'id', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="full_name" />
      <EmailField source="email" />
      <TextField source="membership_tier" />
      <FunctionField
        label="Discount"
        sortBy="discount_percentage"
        render={(record) => `${Number(record.discount_percentage || 0).toFixed(2)}%`}
      />
      {timestamps}
      {rowActions}
    </Datagrid>
  </List>
)
export const UserCreate = () => (
  <Create transform={(record) => transformUser(record, { creating: true })}>
    <UserForm creating />
  </Create>
)
export const UserEdit = () => (
  <Edit transform={transformUser} mutationMode="pessimistic">
    <UserForm />
  </Edit>
)

const CategoryForm = () => (
  <SimpleForm>
    <TextInput source="name" validate={required()} fullWidth />
    <TextInput source="slug" validate={required()} fullWidth />
  </SimpleForm>
)
export const CategoryList = () => (
  <List filters={listFilters} sort={{ field: 'name', order: 'ASC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <DateField source="created_at" showTime />
      {rowActions}
    </Datagrid>
  </List>
)
export const CategoryCreate = () => <Create><CategoryForm /></Create>
export const CategoryEdit = () => <Edit mutationMode="pessimistic"><CategoryForm /></Edit>

const ProductForm = () => (
  <SimpleForm>
    <ReferenceInput source="category_id" reference="categories">
      <SelectInput optionText="name" />
    </ReferenceInput>
    <TextInput source="sku" validate={required()} />
    <TextInput source="title" validate={required()} fullWidth />
    <TextInput source="description" multiline minRows={3} fullWidth />
    <NumberInput source="unit_price" validate={required()} min={0} />
    <TextInput source="image_url" type="url" fullWidth />
    <BooleanInput source="is_active" defaultValue />
  </SimpleForm>
)
export const ProductList = () => (
  <List filters={listFilters} sort={{ field: 'id', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="sku" />
      <TextField source="title" />
      <ReferenceField source="category_id" reference="categories"><TextField source="name" /></ReferenceField>
      <NumberField source="unit_price" options={{ style: 'currency', currency: 'USD' }} />
      <UrlField source="image_url" />
      <BooleanField source="is_active" />
      {rowActions}
    </Datagrid>
  </List>
)
export const ProductCreate = () => <Create><ProductForm /></Create>
export const ProductEdit = () => <Edit mutationMode="pessimistic"><ProductForm /></Edit>

const CartForm = () => (
  <SimpleForm>
    <ReferenceInput source="user_id" reference="users">
      <SelectInput optionText="email" helperText="Choose a user, or leave empty and enter a guest session token." />
    </ReferenceInput>
    <TextInput source="session_token" fullWidth />
  </SimpleForm>
)
export const CartList = () => (
  <List filters={listFilters} sort={{ field: 'created_at', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users" emptyText="Guest"><TextField source="email" /></ReferenceField>
      <TextField source="session_token" emptyText="—" />
      {timestamps}
      {rowActions}
    </Datagrid>
  </List>
)
export const CartCreate = () => <Create><CartForm /></Create>
export const CartEdit = () => <Edit mutationMode="pessimistic"><CartForm /></Edit>

const CartItemForm = () => (
  <SimpleForm>
    <ReferenceInput source="cart_id" reference="carts"><SelectInput validate={required()} /></ReferenceInput>
    <ReferenceInput source="product_id" reference="products"><SelectInput optionText="title" validate={required()} /></ReferenceInput>
    <NumberInput source="quantity" min={1} validate={required()} defaultValue={1} />
  </SimpleForm>
)
export const CartItemList = () => (
  <List filters={listFilters} sort={{ field: 'created_at', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="cart_id" reference="carts" />
      <ReferenceField source="product_id" reference="products"><TextField source="title" /></ReferenceField>
      <NumberField source="quantity" />
      {timestamps}
      {rowActions}
    </Datagrid>
  </List>
)
export const CartItemCreate = () => <Create><CartItemForm /></Create>
export const CartItemEdit = () => <Edit mutationMode="pessimistic"><CartItemForm /></Edit>

const OrderForm = ({ create = false }) => (
  <SimpleForm>
    {create && <ReferenceInput source="user_id" reference="users"><SelectInput optionText="email" /></ReferenceInput>}
    {create && <TextInput source="order_code" validate={required()} />}
    {create && <TextInput source="auth_token" validate={required()} fullWidth />}
    {create && <TextInput source="customer_type" validate={required()} />}
    {create && <TextInput source="customer_name" fullWidth />}
    {create && <TextInput source="customer_email" type="email" fullWidth />}
    {create && <TextInput source="customer_phone" fullWidth />}
    <TextInput source="shipping_address" multiline minRows={3} fullWidth />
    {create && <NumberInput source="subtotal_amount" min={0} defaultValue={0} />}
    {create && <NumberInput source="discount_amount" min={0} defaultValue={0} />}
    <NumberInput source="total_amount" min={0} defaultValue={0} />
    <SelectInput source="status" choices={[
      { id: 'pending', name: 'Pending' },
      { id: 'processing', name: 'Processing' },
      { id: 'shipped', name: 'Shipped' },
      { id: 'completed', name: 'Completed' },
      { id: 'cancelled', name: 'Cancelled' },
    ]} />
  </SimpleForm>
)
export const OrderList = () => (
  <List filters={listFilters} sort={{ field: 'created_at', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="order_code" />
      <TextField source="customer_name" />
      <EmailField source="customer_email" />
      <TextField source="customer_type" />
      <NumberField source="total_amount" options={{ style: 'currency', currency: 'USD' }} />
      <TextField source="status" />
      <DateField source="created_at" showTime />
      <EditButton />
    </Datagrid>
  </List>
)
export const OrderCreate = () => <Create><OrderForm create /></Create>
export const OrderEdit = () => <Edit mutationMode="pessimistic"><OrderForm /></Edit>
export const OrderShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="order_code" />
      <ReferenceField source="user_id" reference="users" emptyText="Guest"><TextField source="email" /></ReferenceField>
      <TextField source="customer_name" />
      <EmailField source="customer_email" />
      <TextField source="customer_phone" />
      <TextField source="shipping_address" />
      <NumberField source="subtotal_amount" options={{ style: 'currency', currency: 'USD' }} />
      <NumberField source="discount_amount" options={{ style: 'currency', currency: 'USD' }} />
      <NumberField source="total_amount" options={{ style: 'currency', currency: 'USD' }} />
      <TextField source="status" />
      <DateField source="created_at" showTime />
    </SimpleShowLayout>
  </Show>
)

const OrderItemForm = () => (
  <SimpleForm>
    <ReferenceInput source="order_id" reference="orders"><SelectInput optionText="order_code" validate={required()} /></ReferenceInput>
    <ReferenceInput source="product_id" reference="products"><SelectInput optionText="title" validate={required()} /></ReferenceInput>
    <TextInput source="sku" validate={required()} />
    <TextInput source="product_title" validate={required()} fullWidth />
    <NumberInput source="unit_price" min={0} validate={required()} />
    <NumberInput source="quantity" min={1} validate={required()} defaultValue={1} />
    <NumberInput source="subtotal" min={0} helperText="Optional; the API calculates it from price × quantity." />
  </SimpleForm>
)
export const OrderItemCreate = () => <Create redirect="orders"><OrderItemForm /></Create>
export const OrderItemList = () => (
  <List
    filters={orderItemFilters}
    filterDefaultValues={{ order_id: 1 }}
    sort={{ field: 'id', order: 'DESC' }}
    emptyWhileLoading
  >
    <Datagrid bulkActionButtons={false}>
      <TextField source="id" />
      <ReferenceField source="order_id" reference="orders"><TextField source="order_code" /></ReferenceField>
      <ReferenceField source="product_id" reference="products"><TextField source="title" /></ReferenceField>
      <TextField source="sku" />
      <TextField source="product_title" />
      <NumberField source="unit_price" options={{ style: 'currency', currency: 'USD' }} />
      <NumberField source="quantity" />
      <NumberField source="subtotal" options={{ style: 'currency', currency: 'USD' }} />
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
)
