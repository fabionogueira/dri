import cx_Oracle
from coadd.models import Release, Dataset, Tile, Tag
from django.conf import settings
from pprint import pprint


# query and database change according with the release to register
DATADISCOVERY = {
    'RELEASES': {
        # TODO [CMP] to implement and change the code
        # 'Y1A1_COADD': {'DATABASE': 'desoper'},
        # 'Y3A1_COADD': {'DATABASE': 'dessci'},
        'Y3A2_COADD': {
            'DATABASE': 'dessci',
            'QUERIES': {
                'TAG': 'SELECT t.tag, MIN(t.created_date) FROM des_admin.y3a2_proctag t WHERE t.tag=\'Y3A2_COADD\' GROUP BY t.tag',
                'TILES_COUNT': 'SELECT COUNT(*) AS count FROM y3a2_proctag t WHERE t.tag=\'Y3A2_COADD\'',
                'PTIF_PATHS': 'SELECT m.tilename, f.path AS archive_path, m.filename, t.created_date FROM y3a2_proctag t, y3a2_file_archive_info f, y3a2_miscfile m WHERE t.pfw_attempt_id = m.pfw_attempt_id AND t.tag=\'Y3A2_COADD\' AND f.filename=m.filename AND m.filetype=\'coadd_ptif\''
            }
        }
    }
}


class DataDiscovery:
    def __init__(self, options):

        self.tag = options['tag']
        self.tag_config = DATADISCOVERY.get('RELEASES').get(self.tag)

        if not self.tag_config:
            raise Exception("Cannot find a configured query for release: %s" % self.tag_config)

        self.database = self.tag_config.get('DATABASE')

        self.db = None
        dbparams = settings.DATABASES.get(self.database)

        if dbparams is None:
            raise Exception("There are no settings for the \'%s\' database." % self.database)

        try:
            pprint(dbparams)
            print ("Connecting to database")
            host, port = dbparams.get('NAME').split(':')
            port, servicename = port.split('/')

            args = {
                'host': host,
                'port': port,
                'service_name': servicename
            }

            dsn = cx_Oracle.makedsn(**args)
            self.db = cx_Oracle.connect(dbparams.get('USER'), dbparams.get('PASSWORD'), dsn=dsn)
            self.cursor = self.db.cursor()

            print ("Connected")

        except Exception as e:
            print(e)

    def start(self):

        # TODO [CMP] old query, probably it does not make sense anymore
        if self.tag == 'ALL':
            excludes = [
                "Y3A1_COADD_TEST_123", "Y3A1_COADD_TEST_123_t025",
                "Y3A1_COADD_TEST_123_t050", "Y3A1_COADD_TEST_123_t100",
                "Y3A1_COADD_TEST_DEEP", "Y3A1_COADD_TEST_11"]

            patterns = [
                "tag='Y3A1_COADD'", "tag='Y3A2_COADD'", "tag='Y3A1_COADD_DEEP'"]

            for pattern in patterns:
                print ("--------------------------------------")

                sql = "SELECT tag, MIN(created_date) as created_date FROM PROD.PROCTAG WHERE %s GROUP BY tag ORDER BY created_date" % pattern

                print ("Finding Tags available: [ %s ]" % sql)

                rows = self.fetchall_dict(sql)

                print ("Tags available: [ %s ]" % len(rows))
                for row in rows:
                    print("Tag Name: %s" % row.get('TAG'))

                for row in rows:
                    print("--------------------------------------")
                    tag = row.get('TAG')

                    if tag in excludes:
                        print("Tag: %s [ Ignored ]" % tag)
                    else:
                        self.register_tag(tag)

        else:
            self.register_tag(self.tag)

        print ("Done!")

    def register_tag(self, requested_tag):

        sql = self.tag_config.get('QUERIES').get('TAG')
        print("Query: %s" % sql)
        rows = self.fetchall_dict(sql)

        for row in rows:
            print("Tag Name: %s" % row.get('TAG'))

        if len(rows) != 1:
            raise Exception("Num of encountered tags: %s" % len(rows))

        row = rows[0]

        tag = row.get('TAG')

        print("Tag: %s  Created Date: %s" % (tag, row.get('CREATED_DATE')))

        # Checar se o Release ja existe no DRI se nao existir criar
        rls_display_name = self.generate_display_name(tag)
        rls_name = tag.lower()
        rls_date = row.get('CREATED_DATE')
        rls_version = 1.0

        release, created = Release.objects.select_related().get_or_create(
            rls_name=rls_name,
            defaults={
                'rls_display_name': rls_display_name,
                'rls_date': rls_date,
                'rls_version': rls_version
            }
        )

        print("Release Created?: [ %s ] Name: [ %s ] ID: [ %s ] " % (created, release, release.id))

        tag_name = rls_name
        tag_display_name = 'All'
        tag_install_date = rls_date

        field, created = Tag.objects.select_related().get_or_create(
            tag_release=release,
            tag_name=rls_name,
            defaults={
                'tag_display_name': tag_display_name,
                'tag_install_date': tag_install_date
            }

        )

        print("Field Created?: [ %s ] Name: [ %s ] ID: [ %s ] " % (created, field, field.id))

        tiles = self.get_tiles_by_tag(tag, field)

        count_created = 0
        count_updated = 0
        count_fail = 0
        count = 0
        for row in tiles:

            count = count + 1

            tilename = row.get('TILENAME')

            try:
                tile = Tile.objects.select_related().get(tli_tilename__icontains=tilename)

                dataset, created = Dataset.objects.update_or_create(
                    tag=field,
                    tile=tile,
                    defaults={
                        'image_src_ptif': row.get('image_src_ptif'),
                        'archive_path': row.get('ARCHIVE_PATH'),
                        'date': row.get('CREATED_DATE')
                    }
                )

                if created:
                    count_created = count_created + 1
                else:
                    count_updated = count_updated + 1

                print("Tile: [%s] [ %s ] Created: [ %s ]" % (format(count, '6d'), tilename, created))

            except Tile.DoesNotExist:
                count_fail = count_fail + 1

        print(
            "Tiles Total [%s] Created [ %s ] Updated [ %s ] Fail [ %s ]" % (
                count, count_created, count_updated, count_fail))

    def get_tiles_by_tag(self, tag, field):

        sql = self.tag_config.get('QUERIES').get('TILES_COUNT')
        print("Query: %s" % sql)

        # Checar se a quantidade de tiles e diferente das registradas
        original_count = self.fetch_scalar(sql)

        print("Tiles Available [ %s ]" % original_count)

        dri_count = Dataset.objects.filter(tag=field).count()

        last_tile = Dataset.objects.filter(tag=field).order_by('-date').first()

        last_date = None
        if last_tile:
            last_date = last_tile.date

            print("Tiles Installed [ %s ] Recent Date [ %s ]" % (dri_count, last_date))

        if original_count != dri_count:
            print ('Tiles to be installed [ %s ]' % (original_count - dri_count))

            sql = self.tag_config.get('QUERIES').get('PTIF_PATHS')

            if last_date:
                sql = sql + " AND t.created_date >= TO_DATE('%s', 'YYYY-MM-DD HH24:MI:SS') " % last_date.strftime('%Y-%m-%d %H:%M:%S')

            sql = sql + " ORDER by t.created_date, m.tilename"

            print("Query: %s" % sql)

            tiles = self.fetchall_dict(sql)

            for tile in tiles:
                image_src_ptif = "http://desportal.cosmology.illinois.edu/visiomatic?FIF=data/releases/desarchive/%s/%s" % (
                    tile.get('ARCHIVE_PATH'), tile.get('FILENAME'))

                tile.update({
                    'image_src_ptif': image_src_ptif.replace("+", "%2B")
                })

            return tiles

        else:
            return list()

    def generate_display_name(self, tag):

        # Remover o A1_COADD ex: Y3A1_COADD_TEST -> Y3_TEST
        display_name = tag.replace('_COADD', '')

        # Camel Case na palavra TEST
        display_name = display_name.replace('_TEST', '_Test')

        # Underscore por espaco
        display_name = display_name.replace('_', ' ')

        return display_name

    def fetchall_dict(self, query):
        self.cursor.execute(query)
        header = [item[0] for item in self.cursor.description]
        rows = self.cursor.fetchall()

        l = list()
        d = dict()
        result_dict = dict()

        for row in rows:
            item = dict(zip(header, row))
            l.append(item)
            result_dict = l

        return result_dict

    def fetch_scalar(self, query, col=0):
        self.cursor.execute(query)
        row = self.cursor.fetchone()
        if row != None:
            return row[col]
        else:
            return None


            # def assocition_tag_tile(self):
            #         """
            #         Usadado para importar um csv com as tiles que fazem parte do release Y1A1 essa funcao faz a assiciacao da
            #         tile com o tag usando o tilename e tag_id
            #         """
            #     print('assocition_tag_tile')
            #
            #     count_created = 0
            #     count_updated = 0
            #     count_fail = 0
            #
            #     import csv
            #     with open("/tmp/test.csv") as csvfile:
            #         reader = csv.DictReader(csvfile, fieldnames=['tag', 'tilename', 'run', 'image_src_ptif'])
            #
            #         for row in reader:
            #             print("%s - %s" % (row['tag'], row['tilename']))
            #             tag = None
            #             if tag != row['tag']:
            #                 tag = Tag.objects.select_related().get(pk=row['tag'])
            #
            #             try:
            #                 tile = Tile.objects.select_related().get(tli_tilename__icontains=row['tilename'])
            #
            #                 dataset, created = Dataset.objects.update_or_create(
            #                     tag=tag,
            #                     tile=tile,
            #                     defaults={
            #                         'image_src_ptif': row['image_src_ptif']
            #                     }
            #                 )
            #
            #                 if created:
            #                     count_created = count_created + 1
            #                 else:
            #                     count_updated = count_updated + 1
            #
            #             except Tile.DoesNotExist:
            #                 count_fail = count_fail + 1


if __name__ == '__main__':
    print ("---------- stand alone -------------")

    DataDiscovery().start()

    # from coadd.datadiscovery import DataDiscovery
    # DataDiscovery().assocition_tag_tile()
