import { Link } from "react-router-dom";

function WomanIllustration() {
  return (
    <svg
      viewBox="0 0 560 650"
      className="h-full w-full"
      role="img"
      aria-label="Illustration of an African woman with natural curly hair using her smartphone to manage her finances"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A9633F" />
          <stop offset="45%" stopColor="#85472F" />
          <stop offset="100%" stopColor="#653321" />
        </linearGradient>

        <linearGradient id="skinLight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C9855C" />
          <stop offset="100%" stopColor="#965536" />
        </linearGradient>

        <linearGradient id="hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#30211B" />
          <stop offset="50%" stopColor="#171412" />
          <stop offset="100%" stopColor="#493027" />
        </linearGradient>

        <linearGradient id="blouse" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#438968" />
          <stop offset="50%" stopColor="#176548" />
          <stop offset="100%" stopColor="#0D4835" />
        </linearGradient>

        <linearGradient id="trousers" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F1E3CC" />
          <stop offset="100%" stopColor="#CDB99B" />
        </linearGradient>

        <linearGradient id="phone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#343638" />
          <stop offset="100%" stopColor="#111315" />
        </linearGradient>

        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>

        <pattern id="fabricTexture" width="9" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 0 L9 9 M9 0 L0 9" stroke="#FFFFFF" strokeOpacity=".055" strokeWidth=".7" />
        </pattern>
      </defs>

      {/* Warm, sunlit room */}
      <ellipse cx="300" cy="605" rx="205" ry="24" fill="#8D765B" opacity=".13" filter="url(#softShadow)" />

      <rect x="35" y="55" width="220" height="230" rx="5" fill="#FFFFFF" opacity=".5" />
      <rect x="47" y="67" width="196" height="206" rx="3" fill="#E8E0CE" />
      <rect x="58" y="78" width="174" height="184" fill="#FCF9F1" />

      {/* Minimal framed botanical art */}
      <path d="M148 238 C146 195 149 151 135 113" fill="none" stroke="#72916B" strokeWidth="3" />
      <path d="M146 185 C113 182 99 160 105 137 C128 142 144 160 146 185Z" fill="#9AB58A" />
      <path d="M148 160 C173 154 185 133 177 111 C155 123 145 142 148 160Z" fill="#688C65" />
      <path d="M147 219 C175 213 190 193 185 176 C163 181 151 198 147 219Z" fill="#B7C5A1" />
      <path d="M147 239 L194 239" stroke="#D9CDB8" strokeWidth="3" />

      {/* Houseplant in the background */}
      <path d="M412 300 C410 235 394 194 380 174" fill="none" stroke="#678C60" strokeWidth="4" />
      <path d="M405 260 C438 249 451 220 441 197 C416 209 404 232 405 260Z" fill="#80A879" />
      <path d="M398 225 C366 214 356 189 369 168 C391 184 401 204 398 225Z" fill="#648A5C" />
      <path d="M411 285 C446 278 462 251 453 232 C429 240 414 260 411 285Z" fill="#A5BD91" />
      <path d="M400 300 C370 285 363 264 375 248 C395 260 402 280 400 300Z" fill="#75976C" />
      <path d="M377 288 L430 288 L420 321 L388 321Z" fill="#C7A783" />

      {/* Sofa */}
      <path d="M75 372 Q75 345 109 342 L426 342 Q473 347 477 389 L493 584 L51 584Z" fill="#D8C6AC" />
      <path d="M78 385 Q78 356 109 355 L422 355 Q452 355 461 388 L475 558 L68 558Z" fill="#F1E5D3" />
      <path d="M64 428 Q60 398 91 395 L133 401 L142 555 L72 555Z" fill="#C7B293" />

      {/* Decorative cushion */}
      <path d="M61 399 Q57 381 78 372 L161 382 Q179 390 175 413 L162 488 Q158 503 139 495 L73 477 Q56 469 61 450Z" fill="#F7F0E4" />
      <path d="M74 398 L150 411 M69 422 L147 440 M72 449 L140 465" stroke="#E2D5C1" strokeWidth="2" />

      {/* Legs and trousers */}
      <path d="M211 461 C190 498 176 534 158 573 C149 594 169 614 197 608 L286 590 C315 584 337 567 347 541 L370 475Z" fill="url(#trousers)" />
      <path d="M299 459 C318 486 338 518 365 548 C383 568 411 575 431 563 L448 553 C458 546 453 530 439 521 L367 457Z" fill="#E9D8BE" />
      <path d="M170 574 C204 575 245 567 281 550" fill="none" stroke="#C3AF91" strokeWidth="2" opacity=".7" />
      <path d="M339 523 Q378 540 413 552" fill="none" stroke="#D1BFA4" strokeWidth="2" opacity=".7" />

      {/* Neck */}
      <path d="M244 260 C247 291 235 316 214 329 L265 373 L325 325 C300 309 292 284 297 257Z" fill="url(#skin)" />

      {/* Natural textured hair behind head */}
      <path
        d="M167 179
           C151 148 173 111 205 103
           C219 75 257 77 277 91
           C309 76 344 101 347 128
           C377 146 383 182 365 207
           C380 237 360 280 344 306
           L327 362 L193 355
           L172 307 C148 281 145 243 163 219Z"
        fill="url(#hair)"
      />

      {/* Hair texture curls */}
      <g fill="none" stroke="#604333" strokeWidth="5" strokeLinecap="round" opacity=".9">
        <path d="M184 155 Q170 136 190 122 Q208 114 205 136" />
        <path d="M214 119 Q229 95 246 117 Q255 130 240 140" />
        <path d="M260 105 Q278 91 292 110 Q302 127 284 136" />
        <path d="M306 120 Q325 101 340 125 Q348 141 331 149" />
        <path d="M177 187 Q156 168 176 152 Q195 143 198 164" />
        <path d="M222 155 Q204 137 222 126 Q243 120 247 143" />
        <path d="M267 151 Q250 132 269 120 Q291 117 292 140" />
        <path d="M317 174 Q338 154 353 176 Q359 195 339 198" />
        <path d="M166 224 Q148 207 168 190 Q186 185 189 204" />
        <path d="M209 205 Q190 184 210 171 Q230 169 233 191" />
        <path d="M258 196 Q239 176 258 164 Q280 161 284 183" />
        <path d="M309 220 Q333 199 348 219 Q355 239 335 245" />
        <path d="M178 263 Q158 245 178 229 Q197 226 200 246" />
        <path d="M222 250 Q204 230 223 218 Q245 217 247 239" />
        <path d="M275 259 Q256 239 277 226 Q299 224 302 247" />
        <path d="M319 280 Q340 259 353 280" />
      </g>

      {/* Face */}
      <path
        d="M191 159
           C201 131 235 120 264 134
           C291 144 310 173 308 211
           C306 250 282 285 250 291
           C223 292 199 265 190 233
           C182 207 181 182 191 159Z"
        fill="url(#skinLight)"
      />

      {/* Soft face highlights */}
      <path d="M200 179 C207 153 226 143 242 145" stroke="#E0A27B" strokeWidth="5" strokeLinecap="round" opacity=".45" fill="none" />
      <ellipse cx="204" cy="221" rx="13" ry="19" fill="#C57D57" opacity=".25" />
      <ellipse cx="287" cy="221" rx="11" ry="17" fill="#6D392B" opacity=".15" />

      {/* Eyebrows */}
      <path d="M202 189 Q216 179 230 188" stroke="#35211B" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M260 187 Q276 177 289 187" stroke="#35211B" strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* Eyes looking down at the phone */}
      <path d="M202 200 Q215 210 229 199" stroke="#38231C" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M261 198 Q275 208 289 195" stroke="#38231C" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <ellipse cx="216" cy="201" rx="4" ry="3.5" fill="#241A15" />
      <ellipse cx="276" cy="199" rx="4" ry="3.5" fill="#241A15" />
      <circle cx="217" cy="200" r="1.2" fill="#FFFFFF" />
      <circle cx="277" cy="198" r="1.2" fill="#FFFFFF" />

      {/* Nose */}
      <path d="M247 199 Q243 218 237 228 Q245 234 254 228" stroke="#79432E" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity=".85" />

      {/* Natural smile */}
      <path d="M224 247 Q247 268 271 244 Q249 255 224 247Z" fill="#6F2D2B" />
      <path d="M228 247 Q248 259 267 246 Q248 250 228 247Z" fill="#FFF0E1" />
      <path d="M232 261 Q248 266 261 258" stroke="#B66A56" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Earrings */}
      <circle cx="189" cy="218" r="5" fill="#D6B56D" />
      <circle cx="303" cy="213" r="5" fill="#D6B56D" />

      {/* Front hair framing the face */}
      <path
        d="M184 177
           C170 148 195 111 225 110
           C252 94 287 110 304 132
           C319 152 317 174 310 195
           C302 168 289 155 271 147
           C246 162 220 161 198 184
           C191 206 196 230 202 249
           C184 235 177 204 184 177Z"
        fill="url(#hair)"
      />

      {/* Curl definition around the forehead */}
      <g fill="none" stroke="#684632" strokeWidth="4" strokeLinecap="round">
        <path d="M199 144 Q210 126 223 141" />
        <path d="M224 129 Q239 112 250 130" />
        <path d="M253 126 Q267 111 280 132" />
        <path d="M280 137 Q298 132 302 151" />
      </g>

      {/* Blouse and sleeves */}
      <path
        d="M218 317
           C195 322 172 337 156 365
           L120 451
           C146 467 178 477 204 477
           L230 398
           L220 469
           C267 492 326 473 364 449
           L330 365
           C320 340 301 323 279 316
           L249 339Z"
        fill="url(#blouse)"
      />

      {/* Fabric detail */}
      <path
        d="M218 317
           C195 322 172 337 156 365
           L120 451
           C146 467 178 477 204 477
           L230 398
           L220 469
           C267 492 326 473 364 449
           L330 365
           C320 340 301 323 279 316
           L249 339Z"
        fill="url(#fabricTexture)"
      />

      {/* Blouse collar */}
      <path d="M218 317 L249 339 L231 369 L208 331Z" fill="#2A7959" />
      <path d="M279 316 L249 339 L270 369 L292 331Z" fill="#39815F" />
      <path d="M249 339 L250 426" stroke="#8FB49B" strokeWidth="1.5" opacity=".6" />
      <g fill="#D8C69D">
        <circle cx="250" cy="363" r="2" />
        <circle cx="250" cy="384" r="2" />
        <circle cx="250" cy="405" r="2" />
      </g>

      {/* Sleeve folds */}
      <path d="M162 367 Q181 382 193 409" stroke="#75A88A" strokeWidth="3" fill="none" opacity=".55" />
      <path d="M331 369 Q311 391 306 420" stroke="#75A88A" strokeWidth="3" fill="none" opacity=".55" />
      <path d="M142 433 Q165 446 183 445" stroke="#0B4936" strokeWidth="3" fill="none" opacity=".7" />

      {/* Forearms holding the phone */}
      <path
        d="M180 429
           C194 419 211 426 228 440
           L273 470
           C284 478 283 492 272 500
           C263 507 253 501 243 495
           L196 469
           C177 459 170 443 180 429Z"
        fill="url(#skin)"
      />

      <path
        d="M307 427
           C293 423 283 435 274 447
           L245 473
           C234 484 239 498 250 503
           C261 508 271 499 281 489
           L316 464
           C330 451 324 434 307 427Z"
        fill="url(#skinLight)"
      />

      {/* Smartphone */}
      <g transform="rotate(-13 249 449)">
        <rect x="213" y="402" width="75" height="112" rx="12" fill="#1E2223" />
        <rect x="218" y="407" width="65" height="101" rx="8" fill="url(#phone)" />
        <rect x="222" y="418" width="57" height="78" rx="4" fill="#F6FAF6" />
        <rect x="239" y="410" width="24" height="3" rx="1.5" fill="#656B6C" />

        {/* Tiny expense interface on the phone */}
        <text x="228" y="430" fontSize="6" fontWeight="bold" fill="#176548">FinanceAI</text>
        <text x="228" y="441" fontSize="5" fill="#6B7280">This month</text>
        <text x="228" y="453" fontSize="10" fontWeight="bold" fill="#1E293B">₦45,500</text>
        <path d="M228 473 L237 466 L245 469 L253 457 L261 462 L273 450" stroke="#16845C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M228 477 L237 470 L245 473 L253 461 L261 466 L273 454 L273 481 L228 481Z" fill="#A7E6C5" opacity=".4" />
        <rect x="228" y="485" width="19" height="4" rx="2" fill="#D8EEE1" />
        <rect x="251" y="485" width="22" height="4" rx="2" fill="#E7E5DF" />
      </g>

      {/* Fingers resting naturally over the phone */}
      <path d="M200 437 Q209 430 220 438 L239 454 Q245 460 239 466 Q234 470 228 465 L207 452Z" fill="#B8734E" />
      <path d="M203 441 L224 458" stroke="#D69A71" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M298 443 Q288 437 279 447 L263 461 Q257 467 263 472 Q268 475 274 469 L292 457Z" fill="#A86443" />
      <path d="M292 447 L274 464" stroke="#D69A71" strokeWidth="2.5" strokeLinecap="round" />

      {/* Wrist jewellery */}
      <path d="M181 433 Q188 428 194 433" stroke="#D7B66F" strokeWidth="3" fill="none" />

      {/* Final highlights */}
      <path d="M345 386 Q354 410 364 436" stroke="#80B398" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".7" />
      <path d="M148 452 Q165 463 188 464" stroke="#65967A" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".65" />
    </svg>
  );
}

function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FAF9F4] text-slate-800">
      {/* Soft, bright background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-28 h-96 w-96 rounded-full bg-emerald-200/40 blur-[110px]" />
        <div className="absolute right-0 top-20 h-[32rem] w-[32rem] rounded-full bg-amber-100/60 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(8,127,91,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(8,127,91,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
          Finance<span className="text-[#087F5B]">AI</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:text-[#087F5B] sm:text-base"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-xl bg-[#087F5B] px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#066749] sm:px-5"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-8 px-6 pb-16 pt-8 md:min-h-[690px] md:grid-cols-2 md:px-12 md:pt-4">
        <div className="relative z-10 max-w-xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-800/10 bg-white/80 px-4 py-2 text-sm font-medium text-[#087F5B] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Your smart way to manage money
          </div>

          <h1 className="text-4xl font-semibold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Take control
            <br />
            of your money.
            <span className="mt-2 block text-[#087F5B]">
              Build your future.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
            FinanceAI helps you track expenses, manage budgets, and make
            smarter financial decisions—one day at a time.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-xl bg-[#087F5B] px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-[#066749]"
            >
              Get Started <span className="ml-2">→</span>
            </Link>

            <Link
              to="/login"
              className="rounded-xl border border-emerald-800/20 bg-white/80 px-7 py-3.5 font-semibold text-[#087F5B] transition hover:bg-emerald-50"
            >
              Log In
            </Link>
          </div>

          {/* Core features */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-800/15 bg-white/80 text-xl text-[#087F5B]">
                ◫
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Track expenses</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Know where your money goes.
              </p>
            </div>

            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-800/15 bg-white/80 text-xl text-[#087F5B]">
                ◷
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Manage budgets</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Set budgets and stay on track.
              </p>
            </div>

            <div>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-800/15 bg-white/80 text-xl text-[#087F5B]">
                ↗
              </div>
              <h3 className="text-sm font-semibold text-slate-800">Achieve goals</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Build better habits for your future.
              </p>
            </div>
          </div>
        </div>

        {/* Woman illustration and finance preview */}
        <div className="relative mx-auto w-full max-w-[540px]">
          <div className="absolute inset-5 rounded-full bg-emerald-200/40 blur-[70px]" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-[#F5F0E4] via-[#E8F2E6] to-[#D7E9DA] shadow-[0_25px_90px_rgba(31,82,54,0.14)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#D5E4D2]/70 via-transparent to-white/20" />

            <div className="relative px-2 pt-4 sm:px-4 sm:pt-6">
              <img
                src="/images/financeai-hero-woman.png"
                alt="Woman using her phone to review her finances"
                className="h-full w-full rounded-3xl object-cover object-center"
              />
            </div>

            {/* Floating financial summary */}
            <div className="absolute right-3 top-[37%] w-[156px] rounded-2xl border border-white/90 bg-white/95 p-3 shadow-xl backdrop-blur-md sm:right-4 sm:w-[190px] sm:p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-700">Overview</p>
                <span className="text-[9px] text-slate-400">This month</span>
              </div>

              <p className="mt-4 text-[10px] text-slate-500">Your spending</p>
              <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">On track</p>

              <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                <span>✓</span>
                <span>Stay within your budget</span>
              </div>

              <svg viewBox="0 0 180 50" className="mt-3 w-full" fill="none" aria-label="Illustrative spending trend">
                <path d="M2 39 C22 37 26 20 45 27 S70 37 87 24 S115 32 131 15 S157 18 178 4" stroke="#087F5B" strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Budget progress</span>
                  <span className="font-bold text-slate-800">65%</span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-50">
                  <div className="h-full w-[65%] rounded-full bg-emerald-600" />
                </div>
              </div>

              <p className="mt-3 text-[9px] leading-4 text-slate-400">
                Illustrative preview, not live financial data.
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs tracking-wide text-slate-500">
            A clearer view of your everyday financial decisions
          </p>
        </div>
      </section>

      {/* Trust and purpose */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-12 md:px-12">
        <div className="grid gap-4 rounded-3xl border border-emerald-900/[0.08] bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:grid-cols-3 sm:p-8">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-[#087F5B]">
              ✓
            </span>
            <div>
              <h2 className="font-semibold text-slate-800">Know where it goes</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Record expenses and understand your spending.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-[#087F5B]">
              ◎
            </span>
            <div>
              <h2 className="font-semibold text-slate-800">Plan with purpose</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Set a budget that supports your priorities.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-[#087F5B]">
              ↗
            </span>
            <div>
              <h2 className="font-semibold text-slate-800">Build better habits</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Take small steps toward financial confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-emerald-900/[0.08] px-6 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} FinanceAI. Thoughtful money management.
      </footer>
    </main>
  );
}

export default Home;