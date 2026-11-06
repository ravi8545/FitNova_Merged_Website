from django.core.management.base import BaseCommand
from supplements.models import SupplementCategory, SupplementProduct, SupplementArticle

class Command(BaseCommand):
    help = 'Seeds initial supplement categories, featured products, and educational articles matching frontend data'

    def handle(self, *args, **options):
        categories_data = [
            ('protein', 'Protein', 'Build & repair muscle', 1),
            ('creatine', 'Creatine', 'Strength & performance', 2),
            ('pre-workout', 'Pre-Workout', 'Energy & focus', 3),
            ('vitamins', 'Vitamins', 'Overall wellness', 4),
            ('amino-acids', 'Amino Acids', 'Recovery & endurance', 5),
            ('fat-burners', 'Fat Burners', 'Support metabolism', 6),
            ('post-workout', 'Post-Workout', 'Faster recovery', 7),
            ('misc', 'Miscellaneous', 'Other supplements', 8),
        ]

        cat_map = {}
        for slug, name, desc, order in categories_data:
            cat, _ = SupplementCategory.objects.get_or_create(
                slug=slug,
                defaults={'name': name, 'description': desc, 'display_order': order}
            )
            cat_map[slug] = cat

        self.stdout.write(self.style.SUCCESS(f'Created {len(cat_map)} categories'))

        products = [
            {
                'name': 'Optimum Nutrition Gold Standard Whey Protein',
                'slug': 'optimum-nutrition-gold-standard-whey',
                'category': cat_map.get('protein'),
                'brand': 'Optimum Nutrition',
                'badge_text': 'Best Seller',
                'badge_color': 'bg-[#2BAF34] text-black font-semibold',
                'rating': 4.8,
                'reviews_count': '12.4k',
                'price': 5499,
                'original_price': 6999,
                'is_featured': True,
                'description': 'The world’s best-selling whey protein powder for rapid muscle recovery and muscle building.'
            },
            {
                'name': 'MuscleBlaze Creatine Monohydrate',
                'slug': 'muscleblaze-creatine-monohydrate',
                'category': cat_map.get('creatine'),
                'brand': 'MuscleBlaze',
                'badge_text': 'Most Popular',
                'badge_color': 'bg-blue-500 text-white font-medium',
                'rating': 4.7,
                'reviews_count': '8.1k',
                'price': 1099,
                'original_price': 1499,
                'is_featured': True,
                'description': 'Pure micronized creatine monohydrate to fuel strength, power, and cellular hydration.'
            },
            {
                'name': 'Cellucor C4 Pre-Workout',
                'slug': 'cellucor-c4-pre-workout',
                'category': cat_map.get('pre-workout'),
                'brand': 'Cellucor',
                'badge_text': 'Trending',
                'badge_color': 'bg-amber-500 text-black font-semibold',
                'rating': 4.6,
                'reviews_count': '6.2k',
                'price': 2299,
                'original_price': 2899,
                'is_featured': True,
                'description': 'Explosive energy and laser focus for high-intensity training sessions.'
            },
            {
                'name': 'MuscleBlaze MB-Vite Multivitamin',
                'slug': 'muscleblaze-mb-vite-multivitamin',
                'category': cat_map.get('vitamins'),
                'brand': 'MuscleBlaze',
                'badge_text': None,
                'rating': 4.6,
                'reviews_count': '4.1k',
                'price': 899,
                'original_price': 1199,
                'is_featured': True,
                'description': 'Comprehensive blend of 25 vitamins and minerals plus immunity boosters.'
            },
            {
                'name': 'MyProtein BCAA 8:1:1 Powder',
                'slug': 'myprotein-bcaa-8-1-1-powder',
                'category': cat_map.get('amino-acids'),
                'brand': 'MyProtein',
                'badge_text': None,
                'rating': 4.4,
                'reviews_count': '3.8k',
                'price': 1499,
                'original_price': 1999,
                'is_featured': True,
                'description': 'Essential branch chain amino acids in an optimal 8:1:1 ratio for enhanced recovery.'
            },
        ]

        for p in products:
            SupplementProduct.objects.update_or_create(
                slug=p['slug'],
                defaults=p
            )

        self.stdout.write(self.style.SUCCESS(f'Created {len(products)} featured products'))

        articles = [
            {
                'title': 'Do You Really Need Supplements?',
                'subtitle': 'A complete guide for beginners.',
                'content': 'Supplements are designed to complement a wholesome diet, not replace real whole foods.',
            },
            {
                'title': 'Creatine Benefits Explained',
                'subtitle': 'Boost strength and performance.',
                'content': 'Creatine increases phosphocreatine stores in muscles, enabling ATP replenishment during heavy lifts.',
            },
            {
                'title': 'Best Supplements for Muscle Gain',
                'subtitle': 'Top picks and how to use them.',
                'content': 'From Whey to Creatine and Omega 3, explore the tier-1 supplements backed by scientific literature.',
            },
        ]

        for a in articles:
            SupplementArticle.objects.get_or_create(title=a['title'], defaults=a)

        self.stdout.write(self.style.SUCCESS('Successfully seeded all supplement data!'))

