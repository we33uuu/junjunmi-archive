export default function FluidBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Galaxy nebula background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/bg-option-b.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      {/* Dark tint overlay for text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(5,4,10,0.45) 0%, rgba(8,5,20,0.35) 40%, rgba(10,6,25,0.5) 75%, rgba(3,2,8,0.6) 100%)',
        }}
      />
    </div>
  );
}
