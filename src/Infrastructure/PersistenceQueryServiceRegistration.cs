using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

using Infrastructure.PostgreSQL;
using Application.Contracts.Invoice;

namespace Infrastructure
{
    public static class PersistenceQueryServiceRegistration
    {
        public static IServiceCollection AddPersistenceQueryServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IDbConnection>(provider =>
            {
                var connectionStringBuilder = new NpgsqlConnectionStringBuilder
                {
                    Host = configuration["DbConnection:PgSQL:Server"],
                    Port = int.Parse(configuration["DbConnection:PgSQL:Port"]),
                    Database = configuration["DbConnection:PgSQL:Database"],
                    Username = configuration["DbConnection:PgSQL:User"],
                    Password = configuration["DbConnection:PgSQL:Password"],
                    IncludeErrorDetail = true
                };

                return new NpgsqlConnection(connectionStringBuilder.ToString());
            });

            services.AddScoped<InvoiceRepositoryDto, InvoiceRepository>();
            //services.AddScoped<IAppMovilCommandRepository, AppMovilRepository>();
            //services.AddScoped<IAncQueryRepository, AncRepository>();

            return services;
        }
    }
}
