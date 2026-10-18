import React, { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  LogOut, Plus, Pencil, Trash2, Eye, ExternalLink, ImagePlus, Save, Search, TrendingUp, MoreHorizontal,
  ArrowUpRight, Menu, Truck, MessageSquare, QrCode, Check, ShieldCheck
} from "lucide-react";
import { money, adminStatusLabel } from "../lib/utils";
import DispatchCenterModal from "../components/DispatchCenterModal";
import { getPaymentConfig, savePaymentConfig } from "../lib/paymentEngine";

function AdminLogin({ onSubmit, error, backendReady, onBack }) {
  return (
    <div className="admin-login-wrap">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <a className="brand" href="#" onClick={e => { e.preventDefault(); onBack(); }}>
          anu<span style={{ color: '#C75B39' }}>kool</span><i>.</i>
        </a>
        <div className="eyebrow muted">SECURE ADMIN PORTAL</div>
        <h1>Welcome back.</h1>
        <p>Sign in to manage inventory, view orders, and oversee artisan kits.</p>
        {!backendReady && (
          <p style={{ background: '#f5eee3', border: '1px solid #e7ded2', color: '#555', padding: 10, borderRadius: 7, fontSize: 11 }}>
            Running in local preview mode. Enter any email and password to access the portal.
          </p>
        )}
        <label className="form-field">Admin Email
          <input type="email" name="email" defaultValue="admin@anukool.in" autoComplete="username" required/>
        </label>
        <label className="form-field">Password
          <input type="password" name="password" defaultValue="admin123" autoComplete="current-password" required/>
        </label>
        {error && <p className="checkout-error" role="alert">{error}</p>}
        <button type="submit" className="button dark-button">
          SIGN IN SECURELY <ArrowUpRight size={16}/>
        </button>
        <button type="button" className="text-link" onClick={onBack}>
          ← Back to storefront
        </button>
      </form>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note, tint }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tint}`}><Icon size={19}/></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}

function AdminDashboard({
  admin,
  onLogout,
  onBack,
  summary = {},
  revenue = 0,
  products = [],
  orders = [],
  tab = 'Overview',
  onTab = () => {},
  editing = null,
  onStartEdit = () => {},
  onStartNew = () => {},
  onCancelEdit = () => {},
  onSaveProduct = () => {},
  form = {},
  onFormChange = () => {},
  onDeleteProduct = () => {},
  orderFilter = 'all',
  onOrderFilter = () => {},
  onUpdateOrderStatus = () => {},
  backendReady = false
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDispatchOrder, setSelectedDispatchOrder] = useState(null);
  const [paymentConfig, setPaymentConfig] = useState(() => getPaymentConfig());
  const [paymentSaved, setPaymentSaved] = useState(false);

  const tabs = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Products', icon: Package },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Dispatch Hub', icon: Truck },
    { name: 'Customers', icon: Users },
    { name: 'Settings', icon: Settings }
  ];

  return (
    <div className="admin-layout">
      <aside className={sidebarOpen ? 'admin-sidebar sidebar-open' : 'admin-sidebar'}>
        <a className="brand admin-brand" href="#" onClick={e => { e.preventDefault(); onBack(); }}>
          anu<span style={{ color: '#C75B39' }}>kool</span><i>.</i>
        </a>
        <div className="admin-side-label">WORKSPACE</div>
        <nav>
          {tabs.map(t => (
            <button
              key={t.name}
              className={tab === t.name ? 'admin-nav-item selected' : 'admin-nav-item'}
              onClick={() => { onTab(t.name); setSidebarOpen(false); }}
            >
              <t.icon size={17}/>
              {t.name}
              {t.name === 'Orders' && orders.length > 0 && <span className="nav-count">{orders.length}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="admin-avatar">AK</div>
          <div>
            <strong>{admin?.name || 'Store Manager'}</strong>
            <small>{admin?.email || 'admin@anukool.in'}</small>
          </div>
          <button className="icon-button" title="Sign out" onClick={onLogout}>
            <LogOut size={17}/>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button className="icon-button admin-menu" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu/></button>
          <div className="breadcrumbs">Workspace <span>/</span> <b>{tab}</b></div>
          <div className="admin-top-actions">
            <span className="status-pill">
              <i></i> {backendReady ? 'Server Connected' : 'Local Preview'}
            </span>
            <button className="button outline-button" onClick={onBack}>
              <Eye size={15}/> View storefront
            </button>
          </div>
        </header>

        <div className="admin-content">
          {tab === 'Overview' && (
            <>
              <div className="admin-title-row">
                <div>
                  <div className="eyebrow muted">STORE AT A GLANCE</div>
                  <h1>Namaste, Maker <span>✳</span></h1>
                  <p>Here is what is happening with Anukool today.</p>
                </div>
                <button className="button dark-button" onClick={onStartNew}><Plus size={16}/> ADD A PRODUCT</button>
              </div>
              <div className="stat-grid">
                <StatCard icon={TrendingUp} label="Paid Revenue" value={money(revenue)} note="Delivered & captured" tint="green"/>
                <StatCard icon={ShoppingCart} label="Total Orders" value={orders.length} note="Live & local batches" tint="yellow"/>
                <StatCard icon={Package} label="Active Kits" value={products.length} note={`${products.reduce((n, p) => n + (p.stock || 0), 0)} units total`} tint="pink"/>
                <StatCard icon={Users} label="Unique Buyers" value={new Set(orders.map(o => o.customerEmail || o.email || o.id)).size} note="Across India" tint="lilac"/>
              </div>

              <div className="admin-panels">
                <section className="admin-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent Orders</h2>
                      <p>Latest craft kits ordered</p>
                    </div>
                    <button className="text-link" onClick={() => onTab('Orders')}>VIEW ALL <ArrowUpRight size={14}/></button>
                  </div>
                  {orders.length ? (
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr><th>ORDER</th><th>DATE</th><th>TOTAL</th><th>STATUS</th></tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map(o => (
                            <tr key={o.id || o.orderNumber}>
                              <td><strong>{o.orderNumber || o.id}</strong></td>
                              <td>{new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN')}</td>
                              <td>{money(o.total)}</td>
                              <td><span className={`order-status ${(o.status || 'paid').toLowerCase()}`}>{adminStatusLabel(o.status || 'paid')}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="admin-empty">
                      <span>📦</span>
                      <strong>No orders yet</strong>
                      <p>Orders placed on the storefront will appear here instantly.</p>
                      <button className="button outline-button" onClick={onBack}>VISIT STOREFRONT</button>
                    </div>
                  )}
                </section>

                <section className="admin-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Inventory Alert</h2>
                      <p>Stock to keep an eye on</p>
                    </div>
                    <button className="text-link" onClick={() => onTab('Products')}>MANAGE <ArrowUpRight size={14}/></button>
                  </div>
                  <div className="inventory-list">
                    {[...products].sort((a, b) => a.stock - b.stock).slice(0, 6).map(p => (
                      <div className="inventory-item" key={p.id}>
                        <div className="inventory-emoji" style={{ background: p.color }}>{p.emoji}</div>
                        <div className="inventory-name">
                          <strong>{p.name}</strong>
                          <small>{p.category}</small>
                        </div>
                        <div className={p.stock < 15 ? 'stock-low' : 'stock-good'}>{p.stock} units left</div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {tab === 'Products' && (
            <>
              <div className="admin-title-row">
                <div>
                  <div className="eyebrow muted">PRODUCT INVENTORY</div>
                  <h1>All Craft Kits <span>({products.length})</span></h1>
                  <p>Add, edit, and adjust inventory levels across all collections.</p>
                </div>
                <button className="button dark-button" onClick={onStartNew}><Plus size={16}/> ADD PRODUCT</button>
              </div>

              <div className="admin-panel product-admin-panel">
                <form className="product-editor" onSubmit={onSaveProduct}>
                  <div className="panel-heading">
                    <div>
                      <h2>{editing !== null ? 'Edit Product' : 'Add New Craft Kit'}</h2>
                      <p>Information shown to customers on the storefront</p>
                    </div>
                    {editing !== null && (
                      <button type="button" className="button outline-button" onClick={onCancelEdit} style={{ padding: '6px 12px', fontSize: 11 }}>
                        Cancel Edit
                      </button>
                    )}
                  </div>
                  <div className="editor-grid">
                    <label className="form-field full-field">Kit Name
                      <input required value={form.name || ''} onChange={e => onFormChange({ ...form, name: e.target.value })} placeholder="e.g. Anukool Silk Block Print Kit"/>
                    </label>
                    <label className="form-field">Category
                      <select value={form.category || 'Gifting & Fabric'} onChange={e => onFormChange({ ...form, category: e.target.value })}>
                        <option>Gifting & Fabric</option>
                        <option>Art & Craft</option>
                        <option>Food</option>
                        <option>Home Decor</option>
                        <option>Care & Fragrance</option>
                        <option>Paper & Books</option>
                      </select>
                    </label>
                    <label className="form-field">Price (₹)
                      <input required type="number" min="1" value={form.price || ''} onChange={e => onFormChange({ ...form, price: e.target.value })} placeholder="799"/>
                    </label>
                    <label className="form-field">Stock Units
                      <input type="number" min="0" value={form.stock || ''} onChange={e => onFormChange({ ...form, stock: e.target.value })} placeholder="25"/>
                    </label>
                    <label className="form-field">Emoji Icon
                      <input value={form.emoji || '🎨'} onChange={e => onFormChange({ ...form, emoji: e.target.value })} maxLength="5"/>
                    </label>
                    <label className="form-field">Badge Tag
                      <input value={form.tag || ''} onChange={e => onFormChange({ ...form, tag: e.target.value })} placeholder="Bestseller / Festive"/>
                    </label>
                    <label className="form-field">Theme Tint
                      <input type="color" value={form.color || '#fde68a'} onChange={e => onFormChange({ ...form, color: e.target.value })}/>
                    </label>
                    <label className="form-field full-field">Description
                      <textarea rows="2" value={form.description || ''} onChange={e => onFormChange({ ...form, description: e.target.value })} placeholder="Describe what makes this kit special..."/>
                    </label>
                  </div>
                  <div className="editor-actions">
                    <button type="submit" className="button dark-button">
                      <Save size={15}/> {editing !== null ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
                    </button>
                  </div>
                </form>

                <div className="table-scroll">
                  <table className="products-table">
                    <thead>
                      <tr><th>PRODUCT</th><th>CATEGORY</th><th>PRICE</th><th>STOCK</th><th>TAG</th><th>ACTIONS</th></tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id}>
                          <td>
                            <div className="table-product">
                              <span style={{ background: p.color }}>{p.emoji}</span>
                              <strong>{p.name}</strong>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td><strong>{money(p.price)}</strong></td>
                          <td><span className={p.stock < 15 ? 'stock-low' : 'stock-good'}>{p.stock}</span></td>
                          <td><span className="product-tag-admin">{p.tag}</span></td>
                          <td>
                            <div className="row-actions">
                              <button type="button" onClick={() => onStartEdit(p)} title="Edit product"><Pencil size={13}/></button>
                              <button type="button" onClick={() => onDeleteProduct(p.id)} title="Delete product"><Trash2 size={13}/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {tab === 'Orders' && (
            <>
              <div className="admin-title-row">
                <div>
                  <div className="eyebrow muted">CUSTOMER FULFILLMENT</div>
                  <h1>Orders <span>({orders.length})</span></h1>
                  <p>Track delivery status, payments, and dispatch notes.</p>
                </div>
              </div>
              <div className="admin-panel">
                {orders.length ? (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr><th>ORDER #</th><th>CUSTOMER</th><th>TOTAL</th><th>DATE</th><th>STATUS</th><th>UPDATE</th><th>DISPATCH & ALERTS</th></tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id || o.orderNumber}>
                            <td><strong>{o.orderNumber || o.id}</strong></td>
                            <td>
                              <div>{o.customerName || o.name || 'Customer'}</div>
                              <small style={{ color: '#888' }}>{o.customerEmail || o.email || '—'}</small>
                            </td>
                            <td><strong>{money(o.total)}</strong></td>
                            <td>{new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN')}</td>
                            <td><span className={`order-status ${(o.status || 'paid').toLowerCase()}`}>{adminStatusLabel(o.status || 'paid')}</span></td>
                            <td>
                              <select
                                className="status-select"
                                value={o.status || 'paid'}
                                onChange={e => onUpdateOrderStatus(o.id, e.target.value)}
                              >
                                <option value="paid">Paid</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="button"
                                onClick={() => setSelectedDispatchOrder(o)}
                                style={{
                                  background: '#2E3A8A',
                                  color: '#FFFFFF',
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: '6px 12px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  borderRadius: 6
                                }}
                              >
                                <Truck size={13} /> Dispatch & WhatsApp
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty">
                    <span>📦</span>
                    <strong>No orders placed yet</strong>
                    <p>Place an order on the storefront to test live order processing.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'Customers' && (
            <>
              <div className="admin-title-row">
                <div>
                  <div className="eyebrow muted">DIRECTORY</div>
                  <h1>Customers</h1>
                  <p>Customer accounts and order history.</p>
                </div>
              </div>
              <div className="admin-panel">
                {orders.length ? (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr><th>NAME</th><th>EMAIL</th><th>PHONE</th><th>LATEST ORDER</th></tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id || o.orderNumber}>
                            <td><strong>{o.customerName || o.name || 'Customer'}</strong></td>
                            <td>{o.customerEmail || o.email || '—'}</td>
                            <td>{o.customerPhone || o.phone || '—'}</td>
                            <td>{o.orderNumber || o.id} ({money(o.total)})</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="admin-empty">
                    <span>👥</span>
                    <strong>No customer records yet</strong>
                    <p>Customer details will appear as orders are placed.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'Dispatch Hub' && (
            <>
              <div className="admin-title-row">
                <div>
                  <div className="eyebrow muted">LOGISTICS & CUSTOMER COMMUNICATIONS</div>
                  <h1>Dispatch & WhatsApp Center</h1>
                  <p>Generate courier AWB tracking, print 4x6" thermal labels, and preview authentic WhatsApp order notifications.</p>
                </div>
              </div>

              <div className="admin-panel" style={{ padding: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#2E3A8A' }}>
                      Ready for Dispatch ({orders.length ? orders.length : 'Demo Mode'})
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: 12, color: '#666' }}>
                      Click any order below to launch the WhatsApp phone mockup & generate instant BlueDart/Delhivery AWB labels.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="button dark-button"
                    onClick={() => setSelectedDispatchOrder(orders[0] || {
                      orderNumber: 'ANK-884920',
                      customerName: 'Aarav Mehta',
                      customerPhone: '9876543210',
                      total: 1498,
                      items: [{ name: 'Anukool Diwali Light-Making Kit (Set of 2)' }],
                      customer: {
                        name: 'Aarav Mehta',
                        addressLine1: 'B-402, Lotus Residency, Malviya Nagar',
                        city: 'Jaipur',
                        state: 'Rajasthan',
                        postalCode: '302017'
                      }
                    })}
                    style={{ background: '#2E3A8A', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Truck size={16}/> LAUNCH LIVE DISPATCH GENERATOR
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>ORDER #</th>
                          <th>CUSTOMER</th>
                          <th>DESTINATION</th>
                          <th>ITEMS</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(o => (
                          <tr key={o.id || o.orderNumber}>
                            <td><strong>{o.orderNumber || o.id}</strong></td>
                            <td>{o.customerName || 'Valued Maker'}</td>
                            <td>{o.customer?.city || 'Jaipur'} ({o.customer?.postalCode || '302001'})</td>
                            <td>{o.items?.[0]?.name || 'Craft Kit'}</td>
                            <td>
                              <button
                                type="button"
                                className="button"
                                onClick={() => setSelectedDispatchOrder(o)}
                                style={{ background: '#25D366', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 6 }}
                              >
                                <MessageSquare size={13}/> Open WhatsApp & AWB
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ background: '#F8F4E9', borderRadius: 12, padding: 24, textAlign: 'center', border: '1px dashed #D4AF37' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🚚</div>
                    <strong style={{ color: '#2E3A8A', fontSize: 16 }}>Test the Dispatch Hub with a Demo Order</strong>
                    <p style={{ fontSize: 12, color: '#666', maxWidth: 460, margin: '8px auto 16px' }}>
                      Experience the realistic smartphone WhatsApp chat preview and 4x6" thermal courier shipping label generator.
                    </p>
                    <button
                      type="button"
                      className="button dark-button"
                      onClick={() => setSelectedDispatchOrder({
                        orderNumber: 'ANK-DEMO-01',
                        customerName: 'Pooja Sharma',
                        customerPhone: '9876543210',
                        total: 1398,
                        items: [{ name: 'Anukool Rakhi Bonding Kit (Artisan Edition)' }],
                        customer: {
                          name: 'Pooja Sharma',
                          addressLine1: 'Plot 18, Textile Enclave, Civil Lines',
                          city: 'Jaipur',
                          state: 'Rajasthan',
                          postalCode: '302006'
                        }
                      })}
                      style={{ background: '#2E3A8A' }}
                    >
                      PREVIEW SAMPLE DISPATCH & WHATSAPP MOCKUP <ArrowUpRight size={14}/>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'Settings' && (
            <div className="settings-grid">
              <div className="admin-panel settings-card">
                <h2>Brand & Store Settings</h2>
                <div className="settings-row"><span>Brand Name</span><strong>Anukool (अनुकूल)</strong></div>
                <div className="settings-row"><span>Tagline</span><strong>Crafted for Connection</strong></div>
                <div className="settings-row"><span>Parent Company</span><strong>V K Enterprises</strong></div>
                <div className="settings-row"><span>Workshop Hub</span><strong>Jaipur, Rajasthan, India</strong></div>
                <div className="settings-row"><span>Support Contact</span><strong>hello@anukool.in</strong></div>
                <div className="settings-row"><span>Free Shipping Level</span><strong>₹999</strong></div>
              </div>

              <div className="admin-panel settings-card">
                <h2>Payment & Compliance</h2>
                <div className="settings-row"><span>Gateway</span><strong>Razorpay (UPI / Cards / NetBanking)</strong></div>
                <div className="settings-row"><span>Default Currency</span><strong>INR (₹)</strong></div>
                <div className="settings-row"><span>GST Handling</span><strong>Inclusive in all prices</strong></div>
                <div className="settings-row"><span>Return Window</span><strong>7 Days</strong></div>
              </div>

              {/* Live Payment Gateway Configuration Card */}
              <div className="admin-panel settings-card" style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h2 style={{ margin: 0 }}>Live Payment Gateway (Razorpay & UPI Deep-Link)</h2>
                  {paymentSaved && (
                    <span style={{ fontSize: 11, background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: 99, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Check size={13}/> Settings Saved!
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: '#555', marginBottom: 16 }}>
                  Configure your live NPCI UPI merchant address and Razorpay keys for instant checkout simulations or live merchant testing.
                </p>

                <form onSubmit={e => {
                  e.preventDefault();
                  savePaymentConfig(paymentConfig);
                  setPaymentSaved(true);
                  setTimeout(() => setPaymentSaved(false), 2500);
                }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <label className="form-field">
                    UPI Merchant VPA (ID)
                    <input
                      required
                      value={paymentConfig.upiVpa}
                      onChange={e => setPaymentConfig({ ...paymentConfig, upiVpa: e.target.value })}
                      placeholder="anukool.jaipur@upi"
                    />
                    <small style={{ color: '#888', marginTop: 4 }}>Used for dynamic SVG QR code generation and mobile upi:// deep-links.</small>
                  </label>

                  <label className="form-field">
                    Payee / Merchant Display Name
                    <input
                      required
                      value={paymentConfig.merchantName}
                      onChange={e => setPaymentConfig({ ...paymentConfig, merchantName: e.target.value })}
                      placeholder="Anukool VK Enterprises"
                    />
                    <small style={{ color: '#888', marginTop: 4 }}>Verified name displayed in Google Pay, PhonePe, Paytm.</small>
                  </label>

                  <label className="form-field">
                    Razorpay Key ID
                    <input
                      value={paymentConfig.razorpayKeyId}
                      onChange={e => setPaymentConfig({ ...paymentConfig, razorpayKeyId: e.target.value })}
                      placeholder="rzp_test_... or rzp_live_..."
                    />
                    <small style={{ color: '#888', marginTop: 4 }}>Live or test API key from Razorpay dashboard.</small>
                  </label>

                  <label className="form-field">
                    Primary Gateway Mode
                    <select
                      value={paymentConfig.mode}
                      onChange={e => setPaymentConfig({ ...paymentConfig, mode: e.target.value })}
                    >
                      <option value="upi_direct">Direct NPCI UPI (QR Code + Deep-Link)</option>
                      <option value="razorpay_gateway">Razorpay Gateway Bridge</option>
                    </select>
                    <small style={{ color: '#888', marginTop: 4 }}>Default tab highlighted during customer checkout.</small>
                  </label>

                  <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                    <button type="submit" className="button dark-button" style={{ background: '#2E3A8A', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Save size={16}/> SAVE PAYMENT GATEWAY SETTINGS
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Dispatch Center Modal for Live WhatsApp Mockup & Thermal AWB Label */}
      {selectedDispatchOrder && (
        <DispatchCenterModal
          order={selectedDispatchOrder}
          onClose={() => setSelectedDispatchOrder(null)}
        />
      )}
    </div>
  );
}

export function AdminSection({
  admin,
  adminLoginError,
  onLogin,
  onLogout,
  onBack,
  summary = {},
  products = [],
  orders = [],
  tab = 'Overview',
  onTab = () => {},
  editing = null,
  onStartEdit = () => {},
  onStartNew = () => {},
  onCancelEdit = () => {},
  onSaveProduct = () => {},
  form = {},
  onFormChange = () => {},
  onDeleteProduct = () => {},
  orderFilter = 'all',
  onOrderFilter = () => {},
  onUpdateOrderStatus = () => {},
  backendReady = false
}) {
  if (!admin) {
    return <AdminLogin onSubmit={onLogin} error={adminLoginError} backendReady={backendReady} onBack={onBack} />;
  }

  const revenue = summary?.revenue ?? orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return (
    <AdminDashboard
      admin={admin}
      onLogout={onLogout}
      onBack={onBack}
      summary={summary}
      revenue={revenue}
      products={products}
      orders={orders}
      tab={tab}
      onTab={onTab}
      editing={editing}
      onStartEdit={onStartEdit}
      onStartNew={onStartNew}
      onCancelEdit={onCancelEdit}
      onSaveProduct={onSaveProduct}
      form={form}
      onFormChange={onFormChange}
      onDeleteProduct={onDeleteProduct}
      orderFilter={orderFilter}
      onOrderFilter={onOrderFilter}
      onUpdateOrderStatus={onUpdateOrderStatus}
      backendReady={backendReady}
    />
  );
}

export default AdminSection;
