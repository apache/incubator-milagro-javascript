/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

/* Finite Field arithmetic  Fp^8 functions */

/* FP8 elements are of the form a+ib, where i is sqrt(sqrt(-1+sqrt(-1)))  */

var FP8 = function(ctx) {
    "use strict";

    /**
      * Creates an instance of FP8
      *
      * @constructor
      * @this {FP4}
      * @param c FP8 / FP4 instance
      * @param d FP4 instance
      */
    var FP8 = function(c, d) {
        if (c instanceof FP8) {
            this.a = new ctx.FP4(c.a);
            this.b = new ctx.FP4(c.b);
        } else {
            this.a = new ctx.FP4(c);
            this.b = new ctx.FP4(d);
        }
    };

    FP8.prototype = {
	
	/**
         * Reduces all components of possibly unreduced FP8 mod Modulus
         *
         * @this {FP8}
         */
        reduce: function() {
            this.a.reduce();
            this.b.reduce();
        },

	/**
         * Normalises the components of an FP8
         *
         * @this {FP8}
         */
        norm: function() {
            this.a.norm();
            this.b.norm();
        },

	/**
         * Tests for FP8 equal to zero
         *
         * @this {FP8}
         */
        iszilch: function() {
            return (this.a.iszilch() && this.b.iszilch());
        },

	/**
         * Tests for FP8 equal to unity
         *
         * @this {FP8}
         */
        isunity: function() {
            var one = new ctx.FP4(1);
            return (this.a.equals(one) && this.b.iszilch());
        },

	/**
         * Conditional copy of FP8 number
         *
         * @this {FP8}
         * @param g FP8 instance
         * @param d copy depends on this value
         */
        cmove: function(g, d) {
            this.a.cmove(g.a, d);
            this.b.cmove(g.b, d);
        },

	/**
         * test is w real? That is in a+ib test b is zero 
         *
         * @this {FP8}
         */
        isreal: function() {
            return this.b.iszilch();
        },

	/**
         * extract real part a
         *
         * @this {FP8}
         */
        real: function() {
            return this.a;
        },

	/**
         * extract a from this
         *
         * @this {FP8}
         */		
        geta: function() {
            return this.a;
        },

	/**
         * extract b from this
         *
         * @this {FP8}
         */	
        getb: function() {
            return this.b;
        },

	/**
         * Tests for equality of two FP8s
         *
         * @this {FP8}
         * @param x FP8 instance to compare
         */
        equals: function(x) {
            return (this.a.equals(x.a) && this.b.equals(x.b));
        },

	/**
         * Copy FP8 to another FP8
         *
         * @this {FP8}
         * @param x FP8 instance to be copied
         */
        copy: function(x) {
            this.a.copy(x.a);
            this.b.copy(x.b);
        },

	/**
         * Set FP8 to zero
         *
         * @this {FP8}
         */
        zero: function() {
            this.a.zero();
            this.b.zero();
        },

	/**
         * Set FP8 to unity
         *
         * @this {FP8}
         * @param x FP8 instance to be set to one
         */
        one: function() {
            this.a.one();
            this.b.zero();
        },

	/**
         * Set FP8 from two FP4 values
         *
         * @this {FP8}
         * @param c FP4 instance
         * @param d FP4 instance
         */
        set: function(c, d) {
            this.a.copy(c);
            this.b.copy(d);
        },

	/**
         * Set FP8 from one FP4 value
         *
         * @this {FP8}
         * @param c FP4 instance
         */
        seta: function(c) {
            this.a.copy(c);
            this.b.zero();
        },

	/**
         * Negation of FP8
         *
         * @this {FP8}
         */
        neg: function() {
            this.norm();
            var m = new ctx.FP4(this.a), 
                t = new ctx.FP4(0);

            m.add(this.b);
            m.neg();
            t.copy(m);
            t.add(this.b);
            this.b.copy(m);
            this.b.add(this.a);
            this.a.copy(t);
            this.norm();
        },

	/**
         * Conjugation of FP8
         *
         * @this {FP8}
         */
        conj: function() {
            this.b.neg();
            this.norm();
        },

	/**
         * Negative conjugation of FP8
         *
         * @this {FP8}
         */
        nconj: function() {
            this.a.neg();
            this.norm();
        },

	/**
         * addition of two FP8s
         *
         * @this {FP8}
         * @param x FP8 instance
         */
        add: function(x) {
            this.a.add(x.a);
            this.b.add(x.b);
        },

	/**
         * subtraction of two FP8s
         *
         * @this {FP8}
         * @param x FP8 instance
         */
        sub: function(x) {
            var m = new FP8(x); 
            m.neg();
            this.add(m);
        },

        rsub: function(x) {
            this.neg();
            this.add(x);
        },

	/**
         * Multiplication of an FP8 by an FP8
         *
         * @this {FP8}
         * @param s FP8 instance
         */
        pmul: function(s) {
            this.a.mul(s);
            this.b.mul(s);
        },

	/**
         * Multiplication of an FP8 by a small integer
         *
         * @this {FP8}
         * @param s integer
         */
        imul: function(c) {
            this.a.imul(c);
            this.b.imul(c);
        },

	/**
         * Fast Squaring of an FP8
         *
         * @this {FP8}
         */
        sqr: function() {
            var t1 = new ctx.FP4(this.a), 
                t2 = new ctx.FP4(this.b), 
                t3 = new ctx.FP4(this.a); 

            t3.mul(this.b);
            t1.add(this.b);
            t1.norm();
            t2.times_i();

            t2.add(this.a);
            t2.norm();
            this.a.copy(t1);

            this.a.mul(t2);

            t2.copy(t3);
            t2.times_i();
            t2.add(t3);

            t2.neg();

            this.a.add(t2);

            this.b.copy(t3);
            this.b.add(t3);

            this.norm();
        },

	/**
         * Full unconditional Multiplication of two FP8s
         *
         * @this {FP8}
         * @param y FP8 instance, the multiplier
         */
        mul: function(y) {
            var t1 = new ctx.FP4(this.a), 
                t2 = new ctx.FP4(this.b), 
                t3 = new ctx.FP4(0),
                t4 = new ctx.FP4(this.b); 

            t1.mul(y.a);
            t2.mul(y.b);
            t3.copy(y.b);
            t3.add(y.a);
            t4.add(this.a);

            t3.norm();
            t4.norm();

            t4.mul(t3);

            t3.copy(t1);
            t3.neg();
            t4.add(t3);
 
            t3.copy(t2);
            t3.neg();
            this.b.copy(t4);
            this.b.add(t3);

            t2.times_i();
            this.a.copy(t2);
            this.a.add(t1);

            this.norm();
        },

	/**
         * convert to hex string
         *
         * @this {FP8}
         */
        toString: function() {
            return ("[" + this.a.toString() + "," + this.b.toString() + "]");
        },

	/**
         * Inverting an FP8
         *
         * @this {FP8}
         */
        inverse: function() {
            this.norm();

            var t1 = new ctx.FP4(this.a), 
                t2 = new ctx.FP4(this.b); 

            t1.sqr();
            t2.sqr();
            t2.times_i();
            t2.norm(); // ??
            t1.sub(t2);
            t1.inverse();
            this.a.mul(t1);
            t1.neg();
            t1.norm();
            this.b.mul(t1);
        },

	/**
         * multiplies an FP8 instance by irreducible polynomial sqrt(1+sqrt(-1))
         *
         * @this {FP8}
         */
        times_i: function() {
            var s = new ctx.FP4(this.b),
                t = new ctx.FP4(this.a);

            s.times_i();
            this.b.copy(t);

            this.a.copy(s);
            this.norm();
        },

	/**
         * multiplies an FP8 instance by irreducible polynomial (1+sqrt(-1))
         *
         * @this {FP8}
         */	
        times_i2: function() {
            this.a.times_i();
            this.b.times_i();
        },

	/**
         * Raises an FP8 to the power of the internal modulus p, using the Frobenius
         *
         * @this {FP8}
         * @param f Modulus
         */
        frob: function(f) {
            var ff=new ctx.FP2(f); ff.sqr(); ff.mul_ip(); ff.norm();
            this.a.frob(ff);
            this.b.frob(ff);
            this.b.pmul(f);
            this.b.times_i();
        },

	/**
         * Raises an FP8 to the power of a BIG
         *
         * @this {FP8}
         * @param e BIG instance exponent
         */
        pow: function(e) {
            var w = new FP8(this), 
                z = new ctx.BIG(e), 
                r = new FP8(1),
                bt;
			w.norm();
			z.norm();
            for (;;) {
                bt = z.parity();
                z.fshr(1);

                if (bt === 1) {
                    r.mul(w);
                }

                if (z.iszilch()) {
                    break;
                }

                w.sqr();
            }
            r.reduce();

            return r;
        },

	/**
         * Calculates the XTR addition function r=w*x-conj(x)*y+z
         *
         * @this {FP8}
         * @param w FP8 instance
         * @param y FP8 instance
         * @param z FP8 instance
         */
        xtr_A: function(w, y, z) {
            var r = new FP8(w), 
                t = new FP8(w); 

            r.sub(y);
            r.norm();
            r.pmul(this.a);
            t.add(y);
            t.norm();
            t.pmul(this.b);
            t.times_i();

            this.copy(r);
            this.add(t);
            this.add(z);

            this.reduce();
        },

	/**
         * Calculates the XTR doubling function r=x^2-2*conj(x)
         *
         * @this {FP8}
         */
        xtr_D: function() {
            var w = new FP8(this); //w.copy(this);
            this.sqr();
            w.conj();
            w.add(w); 
            this.sub(w);
            this.reduce();
        },

	/**
         * Calculates FP8 trace of an FP8 raised to the power of a BIG number
         *
         * @this {FP8}
         * @param n Big number
         */
        xtr_pow: function(n) {
			var sf = new FP8(this);
			sf.norm();
            var a = new FP8(3),
                b = new FP8(sf),
                c = new FP8(b),
                t = new FP8(0),
                r = new FP8(0),
                par, v, nb, i;
	
            c.xtr_D();

            
            par = n.parity();
            v = new ctx.BIG(n);
			v.norm();
            v.fshr(1);

            if (par === 0) {
                v.dec(1);
                v.norm();
            }

            nb = v.nbits();
            for (i = nb - 1; i >= 0; i--) {
                if (v.bit(i) != 1) {
                    t.copy(b);
                    sf.conj();
                    c.conj();
                    b.xtr_A(a, sf, c);
                    sf.conj();
                    c.copy(t);
                    c.xtr_D();
                    a.xtr_D();
                } else {
                    t.copy(a);
                    t.conj();
                    a.copy(b);
                    a.xtr_D();
                    b.xtr_A(c, sf, t);
                    c.xtr_D();
                }
            }

            if (par === 0) {
                r.copy(c);
            } else {
                r.copy(b);
            }
            r.reduce();

            return r;
        },

	/**
         * Calculates FP8 trace of c^a.d^b, where c and d are derived from FP8 traces of FP8s
         *
         * @this {FP8}
         */
        xtr_pow2: function(ck, ckml, ckm2l, a, b) {

            var e = new ctx.BIG(a), 
                d = new ctx.BIG(b), 
                w = new ctx.BIG(0),
                cu = new FP8(ck), 
                cv = new FP8(this), 
                cumv = new FP8(ckml), 
                cum2v = new FP8(ckm2l), 
                r = new FP8(0),
                t = new FP8(0),
                f2 = 0,
                i;

            e.norm();
            d.norm();

            while (d.parity() === 0 && e.parity() === 0) {
                d.fshr(1);
                e.fshr(1);
                f2++;
            }

            while (ctx.BIG.comp(d, e) !== 0) {
                if (ctx.BIG.comp(d, e) > 0) {
                    w.copy(e);
                    w.imul(4);
                    w.norm();

                    if (ctx.BIG.comp(d, w) <= 0) {
                        w.copy(d);
                        d.copy(e);
                        e.rsub(w);
                        e.norm();

                        t.copy(cv);
                        t.xtr_A(cu, cumv, cum2v);
                        cum2v.copy(cumv);
                        cum2v.conj();
                        cumv.copy(cv);
                        cv.copy(cu);
                        cu.copy(t);

                    } else if (d.parity() === 0) {
                        d.fshr(1);
                        r.copy(cum2v);
                        r.conj();
                        t.copy(cumv);
                        t.xtr_A(cu, cv, r);
                        cum2v.copy(cumv);
                        cum2v.xtr_D();
                        cumv.copy(t);
                        cu.xtr_D();
                    } else if (e.parity() == 1) {
                        d.sub(e);
                        d.norm();
                        d.fshr(1);
                        t.copy(cv);
                        t.xtr_A(cu, cumv, cum2v);
                        cu.xtr_D();
                        cum2v.copy(cv);
                        cum2v.xtr_D();
                        cum2v.conj();
                        cv.copy(t);
                    } else {
                        w.copy(d);
                        d.copy(e);
                        d.fshr(1);
                        e.copy(w);
                        t.copy(cumv);
                        t.xtr_D();
                        cumv.copy(cum2v);
                        cumv.conj();
                        cum2v.copy(t);
                        cum2v.conj();
                        t.copy(cv);
                        t.xtr_D();
                        cv.copy(cu);
                        cu.copy(t);
                    }
                }
                if (ctx.BIG.comp(d, e) < 0) {
                    w.copy(d);
                    w.imul(4);
                    w.norm();

                    if (ctx.BIG.comp(e, w) <= 0) {
                        e.sub(d);
                        e.norm();
                        t.copy(cv);
                        t.xtr_A(cu, cumv, cum2v);
                        cum2v.copy(cumv);
                        cumv.copy(cu);
                        cu.copy(t);
                    } else if (e.parity() === 0) {
                        w.copy(d);
                        d.copy(e);
                        d.fshr(1);
                        e.copy(w);
                        t.copy(cumv);
                        t.xtr_D();
                        cumv.copy(cum2v);
                        cumv.conj();
                        cum2v.copy(t);
                        cum2v.conj();
                        t.copy(cv);
                        t.xtr_D();
                        cv.copy(cu);
                        cu.copy(t);
                    } else if (d.parity() == 1) {
                        w.copy(e);
                        e.copy(d);
                        w.sub(d);
                        w.norm();
                        d.copy(w);
                        d.fshr(1);
                        t.copy(cv);
                        t.xtr_A(cu, cumv, cum2v);
                        cumv.conj();
                        cum2v.copy(cu);
                        cum2v.xtr_D();
                        cum2v.conj();
                        cu.copy(cv);
                        cu.xtr_D();
                        cv.copy(t);
                    } else {
                        d.fshr(1);
                        r.copy(cum2v);
                        r.conj();
                        t.copy(cumv);
                        t.xtr_A(cu, cv, r);
                        cum2v.copy(cumv);
                        cum2v.xtr_D();
                        cumv.copy(t);
                        cu.xtr_D();
                    }
                }
            }
            r.copy(cv);
            r.xtr_A(cu, cumv, cum2v);
            for (i = 0; i < f2; i++) {
                r.xtr_D();
            }
            r = r.xtr_pow(d);
            return r;
        },

        /* New stuff for ecp4.js */

	/**
         * Divide an FP8 by 2
         *
         * @this {FP8}
         */		
        div2: function() {
            this.a.div2();
            this.b.div2();
        },

	/**
         * Divide FP8 number by QNR
         *
         * @this {FP8}
         */			
        div_i: function() {
            var u=new ctx.FP4(this.a),
                v=new ctx.FP4(this.b);
            u.div_i();
            this.a.copy(v);
            this.b.copy(u);
        },

	/**
         * Divide an FP8 by QNR twice
         *
         * @this {FP8}
         */						
        div_i2: function() {
            this.a.div_i();
            this.b.div_i();
        },

	/**
         * Divide an FP8 by QNR/2
         *
         * @this {FP8}
         */					
        div_2i: function() {
            var u=new ctx.FP4(this.a),
                v=new ctx.FP4(this.b);
            u.div_2i();
            v.add(v); v.norm();
            this.a.copy(v);
            this.b.copy(u);
        },

	/**
         * Multiplication of an FP8 by an FP2
         *
         * @this {FP8}
         * @param s FP2 multiplier
         */					
        qmul: function(s) {
            this.a.pmul(s);
            this.b.pmul(s);
        },

	/**
         * Multiplication of an FP8 by an FP
         *
         * @this {FP8}
         * @param s FP multiplier
         */						
        tmul: function(s) {
            this.a.qmul(s);
            this.b.qmul(s);
        },

	/**
         * Calculate square root of an FP8
         *
         * @this {FP8}
         */						
        sqrt: function() {
            if (this.iszilch()) {
                return true;
            }
            var wa=new ctx.FP4(this.a),
                ws=new ctx.FP4(this.b),
                wt=new ctx.FP4(this.a);
            if (ws.iszilch()) {
                if (wt.sqrt()) {
                    this.a.copy(wt);
                    this.b.zero();
                } else {
                    wt.div_i();
                    wt.sqrt();
                    this.b.copy(wt);
                    this.a.zero();
                }
                return true;
            }

            ws.sqr();
            wa.sqr();
            ws.times_i();
            ws.norm();
            wa.sub(ws);

            ws.copy(wa);
            if (!ws.sqrt()) {
                return false;
            }

            wa.copy(wt); wa.add(ws); wa.norm(); wa.div2();

            if (!wa.sqrt()) {
                wa.copy(wt); wa.sub(ws); wa.norm(); wa.div2();
                if (!wa.sqrt()) {
                    return false;
                }
            }
            wt.copy(this.b);
            ws.copy(wa); ws.add(wa);
            ws.inverse();

            wt.mul(ws);
            this.a.copy(wa);
            this.b.copy(wt);

            return true;
        }

    };

    return FP8;
};

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = {
        FP8: FP8
    };
}
