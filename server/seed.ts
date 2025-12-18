import { db } from "./db";
import { adminData, projects } from "@shared/schema";

async function seed() {
  try {
    // Clear existing data
    await db.delete(projects);
    await db.delete(adminData);

    // Insert admin data
    await db.insert(adminData).values({
      id: 1,
      bioAr: "مطور واجهات أمامية ومصمم تجربة مستخدم شغوف ببناء تجارب رقمية استثنائية.",
      bioEn: "Passionate Frontend Developer and UI/UX Designer crafting exceptional digital experiences.",
      phone: "+20 123 456 7890",
      profileImage: "/assets/professional_minimal_portrait_of_a_creative_developer-D7osB0Dp.png",
      adminPassword: "admin123"
    });

    // Insert projects
    await db.insert(projects).values([
      {
        titleAr: "تصميم موقع تجارة إلكترونية",
        titleEn: "E-commerce Website Design",
        descriptionAr: "منصة تسوق عصرية مع تجربة مستخدم سلسة ونظام دفع متكامل.",
        descriptionEn: "Modern shopping platform with seamless UX and integrated payment system.",
        categoryAr: "تطوير ويب",
        categoryEn: "Web Development",
        images: ["/assets/modern_minimal_web_design_project_mockup-UWWZ6Lg1.png"]
      },
      {
        titleAr: "تطبيق إدارة المهام",
        titleEn: "Task Management App",
        descriptionAr: "تطبيق موبايل لزيادة الإنتاجية وتنظيم العمل اليومي.",
        descriptionEn: "Mobile application to boost productivity and organize daily work.",
        categoryAr: "تطبيقات موبايل",
        categoryEn: "Mobile App",
        images: ["/assets/mobile_app_interface_design_project_mockup-DYSS4xkq.png"]
      },
      {
        titleAr: "هوية بصرية لشركة تقنية",
        titleEn: "Tech Startup Branding",
        descriptionAr: "تصميم شعار وهوية بصرية كاملة تعكس الابتكار والحداثة.",
        descriptionEn: "Logo design and full visual identity reflecting innovation and modernity.",
        categoryAr: "تصميم جرافيك",
        categoryEn: "Graphic Design",
        images: ["/assets/abstract_digital_art_project_cover-lGH1X6MN.png"]
      }
    ]);

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seed();
