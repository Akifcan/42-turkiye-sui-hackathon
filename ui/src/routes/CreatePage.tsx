import { AthleteProfileForm } from "../features/athlete/AthleteProfileForm";
import { Link } from "react-router-dom";

export function CreatePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-m)' }}>
      <div>
        <Link 
          to="/"
          style={{ 
            color: 'var(--color-brand-primary)',
            textDecoration: 'none',
            fontSize: 'var(--font-size-body)',
            fontFamily: 'var(--font-family-body)',
          }}
        >
          ← Back to Home
        </Link>
      </div>
      <AthleteProfileForm />
    </div>
  );
}

