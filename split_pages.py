import re

with open("src/App.jsx", "r") as f:
    lines = f.readlines()

# The main file keeps up to line 1421 (end of ProductCard)
top_lines = lines[:1421]

header = """import React, { useEffect, useMemo, useState, useRef, Suspense, lazy } from "react";
import {
  Search, ShoppingBag, ArrowUpRight, Sparkles, Menu, X, Plus, Minus,
  SlidersHorizontal, LayoutDashboard, Package, ShoppingCart, Users,
  Settings, Trash2, Pencil, Eye, ChevronDown, Check, Heart, Truck,
  ShieldCheck, Gift, Sprout, Paintbrush, Coffee, LogOut, ExternalLink,
  CircleHelp, TrendingUp, MoreHorizontal, ImagePlus, Save, Mail, MapPin,
  Clock, HelpCircle, FileText, ArrowLeft, Star, Share2, Play, Pause, Volume2, VolumeX
} from "lucide-react";
import { money } from "./lib/utils";
import { AnukoolLoadingSpinner } from "./components/AnukoolLayout";

// Lazy-loaded subpages for high performance & instant initial load
const ProductPage = lazy(() => import("./pages/ProductPage"));
const OurStoryPage = lazy(() => import("./pages/OurStoryPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AdminSection = lazy(() => import("./pages/AdminSection"));
"""

content = header + "".join(top_lines[9:])

# Replace admin rendering with AdminSection component wrapped in Suspense
old_subpages_block = """      ) : page === 'product' && viewingProduct ? (
        <ProductPage
          product={viewingProduct}
          products={products}
          onBack={() => navigate('store')}
          onAddToCart={qty => addToCart(viewingProduct.id, qty)}
          onBuyNow={qty => buyNow(viewingProduct, qty)}
          onSelectRelated={prod => navigate('product', prod)}
          isWishlisted={wishlisted.includes(viewingProduct.id)}
          onToggleWishlist={() => toggleWishlist(viewingProduct.id)}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
        />
      ) : page === 'story' ? (
        <OurStoryPage onBack={() => navigate('store')} onNavigate={navigate} />
      ) : page === 'howitworks' ? (
        <HowItWorksPage onBack={() => navigate('store')} onNavigate={navigate} />
      ) : page === 'faq' ? (
        <FAQPage onBack={() => navigate('store')} onNavigate={navigate} />
      ) : page === 'shipping' ? (
        <ShippingPage onBack={() => navigate('store')} onNavigate={navigate} />
      ) : page === 'contact' ? (
        <ContactPage onBack={() => navigate('store')} onNavigate={navigate} />
      ) : page === 'admin' ? (
        !admin ? (
          <AdminLogin onSubmit={loginAdmin} error={adminLoginError} backendReady={backendReady} onBack={() => navigate('store')} />
        ) : (
          <AdminDashboard
            products={products}
            orders={orders}
            revenue={adminSummary.revenue ?? revenue}
            cartCount={cartCount}
            admin={admin}
            onLogout={logoutAdmin}
            backendReady={backendReady}
            adminTab={adminTab}
            setAdminTab={setAdminTab}
            setView={setPage}
            editing={editing}
            productForm={productForm}
            setProductForm={setProductForm}
            startNewProduct={startNewProduct}
            editProduct={editProduct}
            saveProduct={saveProduct}
            deleteProduct={deleteProduct}
            updateOrderStatus={updateOrderStatus}
            orderFilter={orderFilter}
            setOrderFilter={setOrderFilter}
          />
        )
      ) : null}"""

new_subpages_block = """      ) : (
        <Suspense fallback={<AnukoolLoadingSpinner />}>
          {page === 'product' && viewingProduct ? (
            <ProductPage
              product={viewingProduct}
              products={products}
              onBack={() => navigate('store')}
              onAddToCart={qty => addToCart(viewingProduct.id, qty)}
              onBuyNow={qty => buyNow(viewingProduct, qty)}
              onSelectRelated={prod => navigate('product', prod)}
              isWishlisted={wishlisted.includes(viewingProduct.id)}
              onToggleWishlist={() => toggleWishlist(viewingProduct.id)}
              cartCount={cartCount}
              onOpenCart={() => setCartOpen(true)}
            />
          ) : page === 'story' ? (
            <OurStoryPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'howitworks' ? (
            <HowItWorksPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'faq' ? (
            <FAQPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'shipping' ? (
            <ShippingPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'contact' ? (
            <ContactPage onBack={() => navigate('store')} onNavigate={navigate} />
          ) : page === 'admin' ? (
            <AdminSection
              admin={admin}
              adminLoginError={adminLoginError}
              onLogin={loginAdmin}
              onLogout={logoutAdmin}
              onBack={() => navigate('store')}
              summary={{ ...adminSummary, revenue: adminSummary.revenue ?? revenue }}
              products={products}
              orders={orders}
              tab={adminTab}
              onTab={setAdminTab}
              editing={editing}
              onStartEdit={editProduct}
              onCancelEdit={() => setEditing(null)}
              onSaveProduct={saveProduct}
              form={productForm}
              onFormChange={setProductForm}
              onDeleteProduct={deleteProduct}
              orderFilter={orderFilter}
              onOrderFilter={setOrderFilter}
              onUpdateOrderStatus={updateOrderStatus}
              backendReady={backendReady}
            />
          ) : null}
        </Suspense>
      )}"""

if old_subpages_block in content:
    content = content.replace(old_subpages_block, new_subpages_block)
    print("Replaced old subpages block with Suspense wrapper")
else:
    print("WARNING: old_subpages_block not matched exactly")

# Add loading="lazy" on catalog cards
content = content.replace(
    '<img src={p.image} alt={p.name} className="product-card-img" />',
    '<img src={p.image} alt={p.name} className="product-card-img" loading="lazy" />'
)

# Add preload="none" on reels video
content = content.replace(
    '<video ref={videoRef} src={reel.video} loop muted={muted} playsInline',
    '<video ref={videoRef} src={reel.video} loop muted={muted} playsInline preload="none"'
)

content += "\nexport default App;\n"

with open("src/App.jsx", "w") as f:
    f.write(content)

print("Updated src/App.jsx written successfully")
