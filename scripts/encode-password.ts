/**
 * URL Encode Password Helper
 * 
 * Use this to encode your Supabase password if it contains special characters
 */

function encodePassword(password: string): string {
  return encodeURIComponent(password);
}

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.log('❌ Usage: npx ts-node scripts/encode-password.ts "your-password"');
  console.log('');
  console.log('Example:');
  console.log('  npx ts-node scripts/encode-password.ts "Pass?word+123"');
  console.log('');
  console.log('Special characters that need encoding:');
  console.log('  ? + & = / @ # : [ ] ( ) , ; space');
  process.exit(1);
}

const encoded = encodePassword(password);

console.log('');
console.log('✅ Password Encoding Result:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Original:  ${password}`);
console.log(`Encoded:   ${encoded}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('📝 Use this in your .env file:');
console.log('');
console.log(`DATABASE_URL=postgresql://postgres:${encoded}@<host>:5432/postgres`);
console.log('');
console.log('💡 Tip: If connection still fails, try resetting your password');
console.log('   in Supabase with only letters, numbers, - and _');
console.log('');

export {};
