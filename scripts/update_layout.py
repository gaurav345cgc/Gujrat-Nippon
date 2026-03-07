import os

css_path = r"d:\GitHub\GNIL\gujarat-nippon\app\about\About.module.css"
tsx_path = r"d:\GitHub\GNIL\gujarat-nippon\app\about\page.tsx"

with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

# Replace the SECTION 2 layout in CSS
start_marker = "/* ---- SECTION 2: DARK ABOUT BECOMES LIGHT ABOUT ---- */"
end_marker = "/* ---- SECTION 3: PROJECTS (PHILOSOPHY) ---- */"

new_section_2_css = """
/* ---- SECTION 2: DARK ABOUT BECOMES LIGHT ABOUT ---- */
.darkSection {
    background-color: #FFFFFF;
    padding: 8rem 2rem; /* Matches more spacious layout */
    color: #1D1D1F;
    position: relative;
    overflow: hidden;
}

/* Large watermark */
.watermark {
    position: absolute;
    top: 50%;
    left: -10%;
    transform: translateY(-50%);
    font-size: 30rem;
    font-weight: 900;
    color: rgba(0, 0, 0, 0.02);
    z-index: 0;
    line-height: 1;
    pointer-events: none;
}

.darkContainer {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

@media(min-width: 900px) {
    .darkContainer {
        flex-direction: row;
        gap: 6rem;
    }
}

.aboutLeft {
    flex: 0 0 350px;
    position: relative;
}

.aboutRight {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.sectionTitle {
    font-size: 2.5rem;
    font-weight: 300;
    color: #1D1D1F;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    padding-left: 1.5rem;
}

.sectionTitle::before {
    content: '';
    position: absolute;
    left: 0;
    top: -5px;
    bottom: -5px;
    width: 3px;
    background-color: #4A9E96; /* Teal border next to title */
}

.sectionTitleAccent {
    color: #4A9E96;
    font-weight: 600;
}

.statsRow {
    display: flex;
    justify-content: flex-start;
    gap: 3rem;
    margin-bottom: 4rem;
    flex-wrap: wrap;
}
@media(min-width: 600px) {
    .statsRow {
        gap: 4.5rem;
    }
}

.statItem {
    display: flex;
    flex-direction: column;
}

.statLabel {
    color: #4A9E96; /* Match image small colored label */
    font-size: 0.85rem;
    font-weight: 600;
    line-height: 1.4;
    max-width: 140px;
    margin-bottom: 0.8rem;
}

.statNum {
    font-size: 4rem;
    font-weight: 700;
    line-height: 1;
    color: #1D1D1F;
    letter-spacing: -2px;
}

.aboutTextContainer {
    margin-bottom: 3rem;
    max-width: 750px;
}

.aboutText {
    font-size: 1.1rem;
    line-height: 1.8;
    color: #666666;
}

.aboutBtn {
    align-self: flex-start;
    background: #FFFFFF; 
    color: #1D1D1F;
    border: none;
    background: #fff;
    padding: 12px 28px;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.aboutBtn:hover {
    background: #4A9E96;
    color: #FFFFFF;
}

"""

if start_marker in css_content and end_marker in css_content:
    before = css_content.split(start_marker)[0]
    after = css_content.split(end_marker)[1]
    css_content = before + new_section_2_css + end_marker + after
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)

with open(tsx_path, "r", encoding="utf-8") as f:
    tsx_content = f.read()

# Replace the SECTION 2 TSX layout
start_tsx = "{/* 2. ABOUT COMPANY (with stats) */}"
end_tsx = "{/* 3. OUR PHILOSOPHY (Current Projects Layout) */}"

new_tsx = """{/* 2. ABOUT COMPANY (with stats) */}
            <section className={styles.darkSection}>
                <div className={styles.watermark}>S</div>
                <div className={styles.darkContainer}>
                    <div className={styles.aboutLeft}>
                        <h2 className={styles.sectionTitle}>
                            About <span className={styles.sectionTitleAccent}>Company</span>
                        </h2>
                    </div>
                    
                    <div className={styles.aboutRight}>
                        <div className={styles.statsRow}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Export/Import</span>
                                <span className={styles.statNum}>210+</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Industry Projects</span>
                                <span className={styles.statNum}>510+</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Years Experience</span>
                                <span className={styles.statNum}>18+</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>More Efficiency</span>
                                <span className={styles.statNum}>15%</span>
                            </div>
                        </div>

                        <div className={styles.aboutTextContainer}>
                            <div className={styles.aboutText}>
                                Gujarat Nippon International Private Limited is a globally focused engineering solutions and industrial supply company dedicated to providing industries with cutting-edge machinery, technological expertise, and dependable project execution. Our mission is to provide efficient, precise, and excellent execution that empowers our business partners to achieve operational excellence and long-term success.
                            </div>
                        </div>
                        
                        <button className={styles.aboutBtn}>
                            LEARN MORE <ArrowRight size={16} style={{marginLeft:'8px'}} />
                        </button>
                    </div>
                </div>
            </section>

            """

if start_tsx in tsx_content and end_tsx in tsx_content:
    before = tsx_content.split(start_tsx)[0]
    after = tsx_content.split(end_tsx)[1]
    tsx_content = before + new_tsx + end_tsx + after
    with open(tsx_path, "w", encoding="utf-8") as f:
        f.write(tsx_content)

print("Updated 2 column layout")
