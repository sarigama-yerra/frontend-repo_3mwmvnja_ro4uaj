import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { ShoppingCart, Duck, Leaf, HelpCircle, Mail } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Navbar({ cartCount }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-emerald-800">
          <span className="inline-flex h-9 w-9 rounded-full bg-emerald-100 items-center justify-center text-emerald-700">
            <Duck size={20} />
          </span>
          Duck Tees
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-emerald-800/80">
          <Link to="/products" className="hover:text-emerald-900">Produkte</Link>
          <Link to="/faq" className="hover:text-emerald-900">FAQ</Link>
          <Link to="/contact" className="hover:text-emerald-900">Kontakt</Link>
        </nav>
        <Link to="/cart" className="relative inline-flex items-center gap-2 text-emerald-800">
          <ShoppingCart />
          <span className="sr-only">Warenkorb</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 grid place-items-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 items-center gap-12">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-emerald-900">
            Enten, die Laune machen.
          </h1>
          <p className="mt-4 text-emerald-800/80 text-lg">
            Minimalistische Bio-T-Shirts mit fröhlichen, natur-inspirierten Duck-Designs.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/products" className="px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">Shop starten</Link>
            <Link to="/faq" className="px-6 py-3 rounded-lg border border-emerald-200 text-emerald-800 hover:bg-emerald-50">Mehr erfahren</Link>
          </div>
          <ul className="mt-8 text-emerald-700/80 space-y-2">
            <li className="flex items-center gap-2"><Leaf className="text-emerald-600" size={18}/> Bio-Baumwolle</li>
            <li className="flex items-center gap-2"><Leaf className="text-emerald-600" size={18}/> Klimaneutral gedruckt</li>
            <li className="flex items-center gap-2"><Leaf className="text-emerald-600" size={18}/> Von Enten inspiriert 🦆</li>
          </ul>
        </div>
        <div className="aspect-square rounded-3xl bg-emerald-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.2),transparent_60%)]"/>
          <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-emerald-200"/>
          <div className="absolute -top-8 -right-8 h-64 w-64 rounded-full bg-yellow-200"/>
          <div className="absolute inset-0 grid place-items-center text-8xl">🦆</div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="rounded-2xl overflow-hidden bg-white border border-emerald-100 shadow-sm hover:shadow-md transition">
        <div className="aspect-[4/3] bg-emerald-50">
          <img src={product.images?.[0]} alt={product.title} className="h-full w-full object-cover"/>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-emerald-900 group-hover:text-emerald-700">{product.title}</h3>
          <p className="text-emerald-700/70 text-sm">{(product.price_cents/100).toFixed(2)} €</p>
        </div>
      </div>
    </Link>
  )
}

function Products() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch(`${API_BASE}/api/products`).then(r=>r.json()).then(d=>setProducts(d.products || []))
  }, [])
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6">Unsere T-Shirts</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => <ProductCard key={p.slug} product={p} />)}
      </div>
    </section>
  )
}

function ProductDetail({ addToCart }) {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [size, setSize] = useState('M')
  const [color, setColor] = useState('Forest Green')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    fetch(`${API_BASE}/api/products/${slug}`).then(async r => {
      if (!r.ok) throw new Error('Not found');
      const d = await r.json();
      setProduct(d);
      setSize(d.sizes?.[0] || 'M');
      setColor(d.colors?.[0] || 'Forest Green');
    }).catch(()=>{})
  }, [slug])

  if (!product) return <div className="max-w-6xl mx-auto px-4 py-12">Laden...</div>

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
      <div className="rounded-2xl overflow-hidden bg-white border border-emerald-100">
        <img src={product.images?.[0]} alt={product.title} className="w-full h-full object-cover"/>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-emerald-900">{product.title}</h1>
        <p className="mt-2 text-emerald-800/80">{product.description}</p>
        <p className="mt-4 text-2xl font-semibold text-emerald-900">{(product.price_cents/100).toFixed(2)} €</p>
        <div className="mt-6 flex flex-col gap-3">
          <label className="text-sm text-emerald-800/80">Größe</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes?.map(s => (
              <button key={s} onClick={()=>setSize(s)} className={`px-3 py-1 rounded-full border ${size===s? 'bg-emerald-600 text-white border-emerald-600':'border-emerald-200 text-emerald-800 hover:bg-emerald-50'}`}>{s}</button>
            ))}
          </div>
          <label className="text-sm text-emerald-800/80 mt-4">Farbe</label>
          <div className="flex flex-wrap gap-2">
            {product.colors?.map(c => (
              <button key={c} onClick={()=>setColor(c)} className={`px-3 py-1 rounded-full border ${color===c? 'bg-emerald-600 text-white border-emerald-600':'border-emerald-200 text-emerald-800 hover:bg-emerald-50'}`}>{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <input type="number" min={1} value={qty} onChange={e=>setQty(parseInt(e.target.value)||1)} className="w-20 border border-emerald-200 rounded-lg px-3 py-2"/>
            <button onClick={()=>addToCart({ slug, size, color, quantity: qty, product })} className="px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">In den Warenkorb</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Cart({ cart, setCart }) {
  const navigate = useNavigate()
  const subtotal = cart.reduce((s, i)=> s + (i.product?.price_cents||0)*i.quantity, 0)

  const checkout = async () => {
    const items = cart.map(i => ({ slug: i.slug, quantity: i.quantity, size: i.size, color: i.color }))
    const res = await fetch(`${API_BASE}/api/create-checkout-session`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(items) })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6">Warenkorb</h2>
      {cart.length === 0 ? (
        <div className="text-emerald-800/80">Dein Warenkorb ist leer.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((i, idx) => (
              <div key={idx} className="p-4 border border-emerald-100 rounded-xl bg-white flex items-center gap-4">
                <img src={i.product.images?.[0]} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <div className="font-semibold text-emerald-900">{i.product.title}</div>
                  <div className="text-sm text-emerald-700/70">{i.size} • {i.color}</div>
                </div>
                <input type="number" min={1} value={i.quantity} onChange={e=>{
                  const q = parseInt(e.target.value)||1
                  const copy = [...cart]
                  copy[idx].quantity = q
                  setCart(copy)
                }} className="w-16 border border-emerald-200 rounded-lg px-2 py-1"/>
                <button onClick={()=>{ setCart(cart.filter((_,i2)=>i2!==idx)) }} className="text-emerald-700 hover:text-emerald-900">Entfernen</button>
              </div>
            ))}
          </div>
          <div className="p-4 border border-emerald-100 rounded-xl bg-white h-fit">
            <div className="flex justify-between text-emerald-800 mb-2">
              <span>Zwischensumme</span>
              <span>{(subtotal/100).toFixed(2)} €</span>
            </div>
            <button onClick={checkout} className="mt-4 w-full px-4 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Zur Kasse</button>
          </div>
        </div>
      )}
    </section>
  )
}

function CheckoutSuccess() {
  const params = new URLSearchParams(window.location.search)
  const session_id = params.get('session_id')
  const [status, setStatus] = useState(null)
  useEffect(()=>{
    if (session_id) fetch(`${API_BASE}/api/stripe/session/${session_id}`).then(r=>r.json()).then(setStatus)
  }, [session_id])
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold text-emerald-900">Danke für deinen Einkauf!</h2>
      <p className="mt-2 text-emerald-800/80">Deine Enten-T-Shirts sind bald auf dem Weg.</p>
      {status && (
        <div className="mt-6 p-4 border border-emerald-100 rounded-xl bg-white inline-block text-left">
          <div className="text-emerald-800">Status: {status.payment_status}</div>
          <div className="text-emerald-800">Betrag: {(status.amount_total/100).toFixed(2)} €</div>
        </div>
      )}
      <Link to="/products" className="mt-8 inline-block px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Weiter shoppen</Link>
    </section>
  )
}

function Contact() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2"><Mail size={20}/> Kontakt</h2>
      <p className="text-emerald-800/80">Schreib uns eine Nachricht an hello@ducktees.shop oder nutze unsere Socials. Wir antworten schnell und freundlich.</p>
    </section>
  )
}

function FAQ() {
  const faqs = [
    { q: 'Welche Größen gibt es?', a: 'S bis XL. Fällt normal aus.' },
    { q: 'Wie ist das Material?', a: '100% Bio-Baumwolle, fair produziert.' },
    { q: 'Wie lange dauert der Versand?', a: '2-4 Werktage innerhalb Deutschlands.' },
  ]
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center gap-2"><HelpCircle size={20}/> FAQ</h2>
      <div className="space-y-4">
        {faqs.map((f,i)=> (
          <details key={i} className="group p-4 border border-emerald-100 rounded-xl bg-white">
            <summary className="cursor-pointer font-medium text-emerald-900">{f.q}</summary>
            <p className="mt-2 text-emerald-800/80">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-emerald-50/60">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-emerald-700/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-emerald-800">
          <Duck size={18}/> Duck Tees — Gute Laune seit 2025
        </div>
        <div className="flex gap-6">
          <Link to="/faq" className="hover:text-emerald-900">FAQ</Link>
          <Link to="/contact" className="hover:text-emerald-900">Kontakt</Link>
        </div>
      </div>
    </footer>
  )
}

function Layout({ children, cartCount }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      <Navbar cartCount={cartCount} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <Products />
    </>
  )
}

export default function AppRouter() {
  const [cart, setCart] = useState(()=>{
    try { return JSON.parse(localStorage.getItem('ducktees_cart')||'[]') } catch { return [] }
  })
  useEffect(()=>{ localStorage.setItem('ducktees_cart', JSON.stringify(cart)) }, [cart])

  const addToCart = (item) => setCart(prev => [...prev, item])

  return (
    <BrowserRouter>
      <Layout cartCount={cart.length}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail addToCart={addToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
