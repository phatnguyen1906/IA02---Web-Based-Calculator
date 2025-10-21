# Web Calculator

Một ứng dụng máy tính web được xây dựng với React + Vite, có giao diện đẹp và chức năng đầy đủ.

## 🚀 Tính năng

- ✅ Giao diện đẹp với gradient và animation
- ✅ Hỗ trợ phím tắt bàn phím
- ✅ Tính toán chính xác với số thập phân
- ✅ Xử lý lỗi division by zero
- ✅ Responsive design cho mobile
- ✅ State management với custom hook
- ✅ Unit testing với Vitest
- ✅ ESLint + Prettier code formatting

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 19 + Vite
- **Styling**: CSS3 với gradient và animation
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier
- **Build Tool**: Vite

## 📁 Cấu trúc dự án

```
web-calculator/
├── src/
│   ├── components/          # React components
│   │   ├── Button.jsx      # Button component với styling
│   │   ├── Button.css      # Button styles
│   │   ├── Display.jsx     # Display component
│   │   ├── Display.css     # Display styles
│   │   ├── Keypad.jsx      # Keypad layout
│   │   └── Keypad.css      # Keypad styles
│   ├── logic/              # Business logic
│   │   ├── evaluator.js    # Expression evaluator
│   │   ├── tokens.js       # Token parser
│   │   └── stateMachine.js # Calculator state machine
│   ├── hooks/              # Custom React hooks
│   │   └── useCalculator.js # Calculator state hook
│   ├── styles/             # Global styles
│   │   └── globals.css     # Global CSS
│   ├── tests/              # Test files
│   │   ├── setup.js        # Test setup
│   │   ├── evaluator.test.js # Evaluator tests
│   │   └── calculator.test.jsx # Component tests
│   ├── App.jsx             # Main App component
│   └── main.jsx            # Entry point
├── .eslintrc.js            # ESLint config
├── .prettierrc             # Prettier config
├── vitest.config.js        # Vitest config
├── package.json            # Dependencies & scripts
└── README.md               # Documentation
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm >= 8.0.0

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
# hoặc
npm start
```

### Build cho production
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## 🧪 Testing

### Chạy tests
```bash
npm test
```

### Chạy tests với UI
```bash
npm run test:ui
```

### Chạy tests với coverage
```bash
npm run test:coverage
```

## 🔧 Code Quality

### Linting
```bash
npm run lint
```

### Fix linting issues
```bash
npm run lint:fix
```

### Format code
```bash
npm run format
```

### Check formatting
```bash
npm run format:check
```

## 📱 Sử dụng

### Phím tắt bàn phím
- `0-9`: Nhập số
- `+`, `-`, `*`, `/`: Phép toán
- `Enter` hoặc `=`: Tính kết quả
- `Escape` hoặc `C`: Xóa
- `.`: Số thập phân
- `%`: Phần trăm

### Chức năng
- Tính toán cơ bản: +, -, ×, ÷
- Số thập phân
- Phần trăm
- Đổi dấu số (±)
- Xóa toàn bộ (C)
- Hỗ trợ phím tắt bàn phím

## 🏗️ Kiến trúc

### State Management
- Sử dụng custom hook `useCalculator`
- State machine pattern cho logic phức tạp
- Immutable state updates

### Component Structure
- **App**: Main container với keyboard listeners
- **Display**: Hiển thị kết quả và lịch sử
- **Keypad**: Layout các nút bấm
- **Button**: Reusable button component

### Logic Layer
- **Evaluator**: Shunting Yard algorithm cho expression parsing
- **Tokenizer**: Parse input thành tokens
- **StateMachine**: Quản lý trạng thái calculator

## 🎨 Styling

- CSS3 với gradient backgrounds
- Smooth animations và transitions
- Responsive design cho mobile
- Modern glassmorphism effects
- Accessibility-friendly focus states

## 📊 Performance

- Zero runtime dependencies ngoài React
- Optimized bundle size với Vite
- Lazy loading components
- Efficient re-renders với useCallback

## 🔒 Security

- Client-side only, không backend
- Input validation và sanitization
- Error boundary cho edge cases
- Safe math operations

## 📈 Roadmap

- [ ] History memory
- [ ] Scientific calculator mode
- [ ] Theme switching
- [ ] PWA support
- [ ] Voice input
- [ ] Advanced functions (sin, cos, log, etc.)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.