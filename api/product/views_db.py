from lib.CatalogDB import CatalogDB
from lib.CatalogDB import DBBase

from sqlalchemy.sql import select
from sqlalchemy.sql import column

class CutoutJobsDBHelper:
    def __init__(self, table, schema=None, database=None):
        self.schema = schema

        if database:
            com = CatalogDB(db=database)
        else:
            com = CatalogDB()

        self.db = com.database
        if not self.db.table_exists(table, schema=self.schema):
            raise Exception("Table or view  %s.%s does not exist" %
                            (self.schema, table))

        self.table = self.db.get_table_obj(table, schema=self.schema)
        self.str_columns = [column.key for column in self.table.columns]

    def query_result(self, properties):
        cols = [
            properties.get("meta.id;meta.main"),
            properties.get("pos.eq.ra;meta.main"),
            properties.get("pos.eq.dec;meta.main")
        ]
        columns = list()
        for col in cols:
            if col in self.str_columns:
                columns.append(column(str(col)))

        stm = select(columns).select_from(self.table)
        print("Catalog Query: %s" % str(stm))
        return self.db.fetchall_dict(stm)
