import { ArrowRight, Cpu, Github, Instagram, Mail, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-benefits">
          <div><Truck size={20} /><span><b>Delivered nationwide</b><small>Carefully packed, right to your door</small></span></div>
          <div><ShieldCheck size={20} /><span><b>Build with confidence</b><small>Friendly support for every upgrade</small></span></div>
          <div><Cpu size={20} /><span><b>Curated components</b><small>Parts for your next great build</small></span></div>
        </div>
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="brand-lockup">
              <span className="brand-mark"><Cpu size={18} /></span>
              <span className="brand-name">NEXUS<span>PC</span><small>POWER YOUR NEXT BUILD</small></span>
            </Link>
            <p>Good gear. Better builds. Find the parts that make your next idea real.</p>
            <div className="social-links"><a href="mailto:hello@nexuspc.example" aria-label="Email us"><Mail size={17} /></a><a href="https://instagram.com" aria-label="Instagram"><Instagram size={17} /></a><a href="https://github.com" aria-label="GitHub"><Github size={17} /></a></div>
          </div>
          <div><h4>Explore</h4><Link to="/shop">Shop all</Link><Link to="/shop?featured=true">Featured gear</Link><Link to="/cart">Your cart</Link></div>
          <div><h4>Account</h4><Link to="/account">My profile</Link><Link to="/account/orders">Order history</Link><Link to="/login">Sign in</Link></div>
          <div className="footer-news"><h4>Build notes</h4><p>Fresh gear and setup inspiration, occasionally.</p><Link to="/#newsletter">Join the newsletter <ArrowRight size={13} /></Link><small>Sign-ups are stored securely. No marketing email is sent yet.</small></div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} NEXUS PC. Built for your next build.</span>
          <span>Sample catalog pricing · Philippine pesos</span>
          <span className="footer-owner">Owner: Carlos Miguel Laus · <a href="mailto:cmlaus@ua.edu.ph">cmlaus@ua.edu.ph</a></span>
        </div>
      </div>
    </footer>
  );
}
